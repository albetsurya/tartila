import React from "react";

export interface AsetSvgProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const svgBintangSvg = `<defs><linearGradient id="BintangSvg.bp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD84A"/><stop offset="1" stop-color="#F29A12"/></linearGradient></defs><polygon points="64.0,16.0 79.3,49.0 115.4,53.3 88.7,78.0 95.7,113.7 64.0,96.0 32.3,113.7 39.3,78.0 12.6,53.3 48.7,49.0" fill="#B8590C" stroke="#B8590C" stroke-width="10" stroke-linejoin="round"/><polygon points="64.0,10.0 79.3,43.0 115.4,47.3 88.7,72.0 95.7,107.7 64.0,90.0 32.3,107.7 39.3,72.0 12.6,47.3 48.7,43.0" fill="url(#BintangSvg.bp)" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><ellipse cx="52" cy="46" rx="12" ry="5" fill="#fff" opacity=".5" transform="rotate(-30 52 46)"/>`;

export const BintangSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "bintangPenuh"}
    dangerouslySetInnerHTML={{ __html: svgBintangSvg }}
  />
);

const svgBintangKosongSvg = `<defs></defs><polygon points="64.0,16.0 79.3,49.0 115.4,53.3 88.7,78.0 95.7,113.7 64.0,96.0 32.3,113.7 39.3,78.0 12.6,53.3 48.7,49.0" fill="#9AA6B8" stroke="#9AA6B8" stroke-width="10" stroke-linejoin="round"/><polygon points="64.0,10.0 79.3,43.0 115.4,47.3 88.7,72.0 95.7,107.7 64.0,90.0 32.3,107.7 39.3,72.0 12.6,47.3 48.7,43.0" fill="#E6EBF2" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>`;

export const BintangKosongSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "bintangKosong"}
    dangerouslySetInnerHTML={{ __html: svgBintangKosongSvg }}
  />
);

const svgHatiNyawaSvg = `<defs><linearGradient id="HatiNyawaSvg.hn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A7A"/><stop offset="1" stop-color="#E5483E"/></linearGradient></defs><path d="M64 112 C16 78 10 42 36 28 C52 20 62 30 64 40 C66 30 76 20 92 28 C118 42 112 78 64 112Z" fill="#A82A22" transform="translate(0 6)"/><path d="M64 112 C16 78 10 42 36 28 C52 20 62 30 64 40 C66 30 76 20 92 28 C118 42 112 78 64 112Z" fill="url(#HatiNyawaSvg.hn)" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><ellipse cx="40" cy="44" rx="11" ry="7" fill="#fff" opacity=".45" transform="rotate(-35 40 44)"/>`;

export const HatiNyawaSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "hatiNyawa"}
    dangerouslySetInnerHTML={{ __html: svgHatiNyawaSvg }}
  />
);

const svgMahkotaVipSvg = `<defs><linearGradient id="MahkotaVipSvg.mv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F5BE2B"/></linearGradient></defs><path d="M16 100 L10 44 L38 66 L64 28 L90 66 L118 44 L112 100Z" fill="#B8590C" transform="translate(0 6)" stroke="#B8590C" stroke-width="8" stroke-linejoin="round"/><path d="M16 100 L10 44 L38 66 L64 28 L90 66 L118 44 L112 100Z" fill="url(#MahkotaVipSvg.mv)" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><rect x="18" y="92" width="92" height="14" rx="7" fill="#C28A0E" stroke="#fff" stroke-width="4"/><circle cx="64" cy="28" r="7" fill="#fff"/><circle cx="10" cy="44" r="6" fill="#fff"/><circle cx="118" cy="44" r="6" fill="#fff"/><circle cx="64" cy="76" r="8" fill="#E5483E" stroke="#fff" stroke-width="3"/>`;

export const MahkotaVipSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "mahkotaVip"}
    dangerouslySetInnerHTML={{ __html: svgMahkotaVipSvg }}
  />
);

const svgApiStreakSvg = `<defs><linearGradient id="ApiStreakSvg.as" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFA13D"/><stop offset="1" stop-color="#E2561A"/></linearGradient></defs><path d="M64 8 C70 32 96 44 96 76 C96 99 82 116 64 116 C46 116 32 99 32 76 C32 62 40 54 46 46 C48 56 54 62 60 60 C55 44 57 26 64 8Z" fill="#A63C0E" transform="translate(0 5)"/><path d="M64 8 C70 32 96 44 96 76 C96 99 82 116 64 116 C46 116 32 99 32 76 C32 62 40 54 46 46 C48 56 54 62 60 60 C55 44 57 26 64 8Z" fill="url(#ApiStreakSvg.as)" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><path d="M64 62 C70 78 82 84 82 98 C82 108 74 114 64 114 C54 114 46 108 46 98 C46 86 58 80 64 62Z" fill="#FFE27A"/>`;

export const ApiStreakSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "apiStreak"}
    dangerouslySetInnerHTML={{ __html: svgApiStreakSvg }}
  />
);

const svgApiStreakMatiSvg = `<defs></defs><path d="M64 8 C70 32 96 44 96 76 C96 99 82 116 64 116 C46 116 32 99 32 76 C32 62 40 54 46 46 C48 56 54 62 60 60 C55 44 57 26 64 8Z" fill="#9AA6B8" transform="translate(0 5)"/><path d="M64 8 C70 32 96 44 96 76 C96 99 82 116 64 116 C46 116 32 99 32 76 C32 62 40 54 46 46 C48 56 54 62 60 60 C55 44 57 26 64 8Z" fill="#E6EBF2" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><path d="M64 62 C70 78 82 84 82 98 C82 108 74 114 64 114 C54 114 46 108 46 98 C46 86 58 80 64 62Z" fill="#CBD3DF"/>`;

export const ApiStreakMatiSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "apiStreakMati"}
    dangerouslySetInnerHTML={{ __html: svgApiStreakMatiSvg }}
  />
);

const svgBukuJuzAmmaSvg = `<defs><linearGradient id="BukuJuzAmmaSvg.bja" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E9B7B"/><stop offset="1" stop-color="#3F6B52"/></linearGradient></defs><ellipse cx="62" cy="142" rx="44" ry="5" fill="#000" opacity=".12"/><rect x="14" y="12" width="92" height="126" rx="10" fill="#2C4D3A"/><rect x="14" y="8" width="92" height="126" rx="10" fill="url(#BukuJuzAmmaSvg.bja)" stroke="#fff" stroke-width="4"/><rect x="14" y="8" width="16" height="126" rx="8" fill="#2C4D3A" opacity=".35"/><rect x="96" y="14" width="8" height="114" rx="3" fill="#FFF8EE" opacity=".9"/><circle cx="64" cy="54" r="26" fill="none" stroke="#FFCB45" stroke-width="3"/><path d="M70 38 A17 17 0 1 0 78 64 A13 13 0 1 1 70 38Z" fill="#FFCB45"/><polygon points="74.0,44.0 75.5,47.9 79.7,48.1 76.5,50.8 77.5,54.9 74.0,52.6 70.5,54.9 71.5,50.8 68.3,48.1 72.5,47.9" fill="#FFCB45"/><text x="64" y="106" text-anchor="middle" font-size="14" font-weight="800" letter-spacing="2" fill="#DDEFD3" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif">JUZ 30</text><path d="M78 8 V32 L85 26 L92 32 V8Z" fill="#F58A3A"/>`;

export const BukuJuzAmmaSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 120 150"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "bukuJuzAmma"}
    dangerouslySetInnerHTML={{ __html: svgBukuJuzAmmaSvg }}
  />
);

const svgBukuTilawatiJilid1Svg = `<defs><linearGradient id="BukuTilawatiJilid1Svg.bukuTilawatiJilid1g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB08C"/><stop offset="1" stop-color="#3F6B52"/></linearGradient></defs><ellipse cx="62" cy="142" rx="44" ry="5" fill="#000" opacity=".12"/><rect x="14" y="12" width="92" height="126" rx="10" fill="#2C4D3A"/><rect x="14" y="8" width="92" height="126" rx="10" fill="url(#BukuTilawatiJilid1Svg.bukuTilawatiJilid1g)" stroke="#fff" stroke-width="4"/><rect x="14" y="8" width="16" height="126" rx="8" fill="#2C4D3A" opacity=".35"/><rect x="96" y="14" width="8" height="114" rx="3" fill="#FFF8EE" opacity=".9"/><rect x="38" y="24" width="52" height="68" rx="10" fill="#FFF8EE" opacity=".95"/><text x="64" y="46" text-anchor="middle" font-size="11" font-weight="800" fill="#2C4D3A" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >JILID</text><text x="64" y="82" text-anchor="middle" font-size="34" font-weight="800" fill="#3F6B52" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >1</text><text x="64" y="108" text-anchor="middle" font-size="11" font-weight="800" fill="#FFF8EE" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" letter-spacing="1.5">TILAWATI</text><rect x="46" y="116" width="36" height="5" rx="2.5" fill="#fff" opacity=".5"/><path d="M78 8 V30 L85 24 L92 30 V8Z" fill="#FFCB45"/>`;

export const BukuTilawatiJilid1Svg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 120 150"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "bukuTilawatiJilid1"}
    dangerouslySetInnerHTML={{ __html: svgBukuTilawatiJilid1Svg }}
  />
);

const svgBukuTilawatiJilid2Svg = `<defs><linearGradient id="BukuTilawatiJilid2Svg.bukuTilawatiJilid2g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CC3E6"/><stop offset="1" stop-color="#2F93C4"/></linearGradient></defs><ellipse cx="62" cy="142" rx="44" ry="5" fill="#000" opacity=".12"/><rect x="14" y="12" width="92" height="126" rx="10" fill="#1E6D96"/><rect x="14" y="8" width="92" height="126" rx="10" fill="url(#BukuTilawatiJilid2Svg.bukuTilawatiJilid2g)" stroke="#fff" stroke-width="4"/><rect x="14" y="8" width="16" height="126" rx="8" fill="#1E6D96" opacity=".35"/><rect x="96" y="14" width="8" height="114" rx="3" fill="#FFF8EE" opacity=".9"/><rect x="38" y="24" width="52" height="68" rx="10" fill="#FFF8EE" opacity=".95"/><text x="64" y="46" text-anchor="middle" font-size="11" font-weight="800" fill="#1E6D96" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >JILID</text><text x="64" y="82" text-anchor="middle" font-size="34" font-weight="800" fill="#2F93C4" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >2</text><text x="64" y="108" text-anchor="middle" font-size="11" font-weight="800" fill="#FFF8EE" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" letter-spacing="1.5">TILAWATI</text><rect x="46" y="116" width="36" height="5" rx="2.5" fill="#fff" opacity=".5"/><path d="M78 8 V30 L85 24 L92 30 V8Z" fill="#FFCB45"/>`;

export const BukuTilawatiJilid2Svg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 120 150"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "bukuTilawatiJilid2"}
    dangerouslySetInnerHTML={{ __html: svgBukuTilawatiJilid2Svg }}
  />
);

const svgBukuTilawatiJilid3Svg = `<defs><linearGradient id="BukuTilawatiJilid3Svg.bukuTilawatiJilid3g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58A3A"/><stop offset="1" stop-color="#E2561A"/></linearGradient></defs><ellipse cx="62" cy="142" rx="44" ry="5" fill="#000" opacity=".12"/><rect x="14" y="12" width="92" height="126" rx="10" fill="#A63C0E"/><rect x="14" y="8" width="92" height="126" rx="10" fill="url(#BukuTilawatiJilid3Svg.bukuTilawatiJilid3g)" stroke="#fff" stroke-width="4"/><rect x="14" y="8" width="16" height="126" rx="8" fill="#A63C0E" opacity=".35"/><rect x="96" y="14" width="8" height="114" rx="3" fill="#FFF8EE" opacity=".9"/><rect x="38" y="24" width="52" height="68" rx="10" fill="#FFF8EE" opacity=".95"/><text x="64" y="46" text-anchor="middle" font-size="11" font-weight="800" fill="#A63C0E" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >JILID</text><text x="64" y="82" text-anchor="middle" font-size="34" font-weight="800" fill="#E2561A" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >3</text><text x="64" y="108" text-anchor="middle" font-size="11" font-weight="800" fill="#FFF8EE" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" letter-spacing="1.5">TILAWATI</text><rect x="46" y="116" width="36" height="5" rx="2.5" fill="#fff" opacity=".5"/><path d="M78 8 V30 L85 24 L92 30 V8Z" fill="#FFCB45"/>`;

export const BukuTilawatiJilid3Svg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 120 150"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "bukuTilawatiJilid3"}
    dangerouslySetInnerHTML={{ __html: svgBukuTilawatiJilid3Svg }}
  />
);

const svgBukuTilawatiJilid4Svg = `<defs><linearGradient id="BukuTilawatiJilid4Svg.bukuTilawatiJilid4g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A98BD6"/><stop offset="1" stop-color="#7A55B3"/></linearGradient></defs><ellipse cx="62" cy="142" rx="44" ry="5" fill="#000" opacity=".12"/><rect x="14" y="12" width="92" height="126" rx="10" fill="#573A86"/><rect x="14" y="8" width="92" height="126" rx="10" fill="url(#BukuTilawatiJilid4Svg.bukuTilawatiJilid4g)" stroke="#fff" stroke-width="4"/><rect x="14" y="8" width="16" height="126" rx="8" fill="#573A86" opacity=".35"/><rect x="96" y="14" width="8" height="114" rx="3" fill="#FFF8EE" opacity=".9"/><rect x="38" y="24" width="52" height="68" rx="10" fill="#FFF8EE" opacity=".95"/><text x="64" y="46" text-anchor="middle" font-size="11" font-weight="800" fill="#573A86" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >JILID</text><text x="64" y="82" text-anchor="middle" font-size="34" font-weight="800" fill="#7A55B3" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >4</text><text x="64" y="108" text-anchor="middle" font-size="11" font-weight="800" fill="#FFF8EE" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" letter-spacing="1.5">TILAWATI</text><rect x="46" y="116" width="36" height="5" rx="2.5" fill="#fff" opacity=".5"/><path d="M78 8 V30 L85 24 L92 30 V8Z" fill="#FFCB45"/>`;

export const BukuTilawatiJilid4Svg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 120 150"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "bukuTilawatiJilid4"}
    dangerouslySetInnerHTML={{ __html: svgBukuTilawatiJilid4Svg }}
  />
);

const svgBukuTilawatiJilid5Svg = `<defs><linearGradient id="BukuTilawatiJilid5Svg.bukuTilawatiJilid5g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58AAE"/><stop offset="1" stop-color="#D14E7C"/></linearGradient></defs><ellipse cx="62" cy="142" rx="44" ry="5" fill="#000" opacity=".12"/><rect x="14" y="12" width="92" height="126" rx="10" fill="#9E2E55"/><rect x="14" y="8" width="92" height="126" rx="10" fill="url(#BukuTilawatiJilid5Svg.bukuTilawatiJilid5g)" stroke="#fff" stroke-width="4"/><rect x="14" y="8" width="16" height="126" rx="8" fill="#9E2E55" opacity=".35"/><rect x="96" y="14" width="8" height="114" rx="3" fill="#FFF8EE" opacity=".9"/><rect x="38" y="24" width="52" height="68" rx="10" fill="#FFF8EE" opacity=".95"/><text x="64" y="46" text-anchor="middle" font-size="11" font-weight="800" fill="#9E2E55" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >JILID</text><text x="64" y="82" text-anchor="middle" font-size="34" font-weight="800" fill="#D14E7C" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" >5</text><text x="64" y="108" text-anchor="middle" font-size="11" font-weight="800" fill="#FFF8EE" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif" letter-spacing="1.5">TILAWATI</text><rect x="46" y="116" width="36" height="5" rx="2.5" fill="#fff" opacity=".5"/><path d="M78 8 V30 L85 24 L92 30 V8Z" fill="#FFCB45"/>`;

export const BukuTilawatiJilid5Svg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 120 150"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "bukuTilawatiJilid5"}
    dangerouslySetInnerHTML={{ __html: svgBukuTilawatiJilid5Svg }}
  />
);

const svgKartuMatchCocokSvg = `<defs><linearGradient id="KartuMatchCocokSvg.cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFF3E0"/></linearGradient><linearGradient id="KartuMatchCocokSvg.cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4F3A"/><stop offset="1" stop-color="#4E3022"/></linearGradient><linearGradient id="KartuMatchCocokSvg.cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E9B7B"/><stop offset="1" stop-color="#3F6B52"/></linearGradient><linearGradient id="KartuMatchCocokSvg.cx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6EBF2"/><stop offset="1" stop-color="#C9D1DE"/></linearGradient></defs><g transform="rotate(0 58.0 82.0)"><rect x="11" y="17" width="100" height="144" rx="18" fill="#000" opacity=".16"/><rect x="8" y="10" width="100" height="144" rx="18" fill="url(#KartuMatchCocokSvg.cw)" stroke="#7FB08C" stroke-width="6"/><rect x="17" y="19" width="82" height="126" rx="11" fill="none" stroke="#E9D9C0" stroke-width="2.5"/><text x="58.0" y="104.0" text-anchor="middle" font-size="68" fill="#5A3A2A" font-family="'Amiri','Noto Naskh Arabic','Scheherazade New',serif">ب</text></g><circle cx="104" cy="28" r="20" fill="#2C4D3A"/><circle cx="104" cy="24" r="20" fill="#3F6B52" stroke="#fff" stroke-width="4"/><path d="M94 25 L101 32 L115 16" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`;

export const KartuMatchCocokSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 130 176"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "kartuMatchCocok"}
    dangerouslySetInnerHTML={{ __html: svgKartuMatchCocokSvg }}
  />
);

const svgTebakSurahBaruSvg = `<defs><linearGradient id="TebakSurahBaruSvg.cw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFF3E0"/></linearGradient><linearGradient id="TebakSurahBaruSvg.cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A4F3A"/><stop offset="1" stop-color="#4E3022"/></linearGradient><linearGradient id="TebakSurahBaruSvg.cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E9B7B"/><stop offset="1" stop-color="#3F6B52"/></linearGradient><linearGradient id="TebakSurahBaruSvg.cx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6EBF2"/><stop offset="1" stop-color="#C9D1DE"/></linearGradient></defs><g transform="rotate(-10 74.0 100.0)"><rect x="27" y="37" width="100" height="140" rx="18" fill="#000" opacity=".16"/><rect x="24" y="30" width="100" height="140" rx="18" fill="url(#TebakSurahBaruSvg.cb)" stroke="#7A4F3A" stroke-width="4"/><rect x="33" y="39" width="82" height="122" rx="11" fill="none" stroke="#9C6B53" stroke-width="2.5"/><text x="74.0" y="122.0" text-anchor="middle" font-size="58" fill="#F3E6D3" opacity=".75" font-family="'Amiri','Noto Naskh Arabic','Scheherazade New',serif">ق</text></g><g transform="rotate(9 142.0 90.0)"><rect x="95" y="27" width="100" height="140" rx="18" fill="#000" opacity=".16"/><rect x="92" y="20" width="100" height="140" rx="18" fill="url(#TebakSurahBaruSvg.cg)" stroke="#A9C9B3" stroke-width="4"/><rect x="101" y="29" width="82" height="122" rx="11" fill="none" stroke="#C9E0CF" stroke-width="2.5"/><text x="142.0" y="58" text-anchor="middle" font-size="13" font-weight="700" letter-spacing="2" fill="#DDEFD3" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif">JUZ 30</text><text x="142.0" y="120.0" text-anchor="middle" font-size="76" font-weight="800" fill="#fff" font-family="'Plus Jakarta Sans','Poppins',system-ui,sans-serif">?</text></g><rect x="176" y="14" width="14" height="14" rx="4" fill="#C28A0E" transform="rotate(30 183 21)"/><path transform="translate(36 24) scale(1)" opacity="1" fill="#7FB08C" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/>`;

export const TebakSurahBaruSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 220 190"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "tebakSurahBaru"}
    dangerouslySetInnerHTML={{ __html: svgTebakSurahBaruSvg }}
  />
);

const svgOrnamenPeciSvg = `<defs><linearGradient id="OrnamenPeciSvg.pc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A2A"/><stop offset="1" stop-color="#2B1B12"/></linearGradient></defs><path d="M14 72 L22 24 C22 14 108 14 108 24 L116 72Z" fill="url(#OrnamenPeciSvg.pc)" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><rect x="14" y="64" width="102" height="14" rx="7" fill="#2B1B12" stroke="#fff" stroke-width="3"/><path d="M40 26 V64 M65 24 V64 M90 26 V64" stroke="#fff" stroke-opacity=".14" stroke-width="3"/>`;

export const OrnamenPeciSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 130 90"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "ornamenPeci"}
    dangerouslySetInnerHTML={{ __html: svgOrnamenPeciSvg }}
  />
);

const svgOrnamenKilauSvg = `<defs><linearGradient id="OrnamenKilauSvg.ok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE27A"/><stop offset="1" stop-color="#F5BE2B"/></linearGradient></defs><path d="M32 2 C34 20 44 30 62 32 C44 34 34 44 32 62 C30 44 20 34 2 32 C20 30 30 20 32 2Z" fill="url(#OrnamenKilauSvg.ok)"/>`;

export const OrnamenKilauSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "ornamenKilau"}
    dangerouslySetInnerHTML={{ __html: svgOrnamenKilauSvg }}
  />
);

const svgBenderaCheckpointSvg = `<defs><linearGradient id="BenderaCheckpointSvg.bc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB08C"/><stop offset="1" stop-color="#3F6B52"/></linearGradient></defs><ellipse cx="40" cy="116" rx="26" ry="5" fill="#000" opacity=".12"/><rect x="34" y="14" width="9" height="102" rx="4.5" fill="#5A3A2A"/><circle cx="38.5" cy="14" r="8" fill="#FFCB45" stroke="#fff" stroke-width="3"/><path d="M43 24 C62 16 78 34 112 24 V70 C78 80 62 62 43 70Z" fill="url(#BenderaCheckpointSvg.bc)" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M62 46 L74 58 L96 36" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;

export const BenderaCheckpointSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "benderaCheckpoint"}
    dangerouslySetInnerHTML={{ __html: svgBenderaCheckpointSvg }}
  />
);

const svgIconGamesSvg = `<defs><linearGradient id="IconGamesSvg.iconGamesg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58AAE"/><stop offset="1" stop-color="#D14E7C"/></linearGradient></defs><circle cx="48" cy="58" r="42" fill="#9E2E55"/><circle cx="48" cy="50" r="42" fill="url(#IconGamesSvg.iconGamesg)"/><circle cx="48" cy="50" r="42" fill="none" stroke="#fff" stroke-width="4"/><ellipse cx="36" cy="28" rx="16" ry="6" fill="#fff" opacity=".3" transform="rotate(-20 36 28)"/><rect x="20" y="34" width="56" height="34" rx="17" fill="#fff"/><rect x="31" y="46" width="16" height="6" rx="3" fill="#D14E7C"/><rect x="36" y="41" width="6" height="16" rx="3" fill="#D14E7C"/><circle cx="58" cy="53" r="4" fill="#D14E7C"/><circle cx="67" cy="46" r="4" fill="#D14E7C"/>`;

export const IconGamesSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 96 104"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconGames"}
    dangerouslySetInnerHTML={{ __html: svgIconGamesSvg }}
  />
);

const svgIconPlaySvg = `<defs><linearGradient id="IconPlaySvg.iconPlayg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB08C"/><stop offset="1" stop-color="#3F6B52"/></linearGradient></defs><circle cx="48" cy="58" r="42" fill="#2C4D3A"/><circle cx="48" cy="50" r="42" fill="url(#IconPlaySvg.iconPlayg)"/><circle cx="48" cy="50" r="42" fill="none" stroke="#fff" stroke-width="4"/><ellipse cx="36" cy="28" rx="16" ry="6" fill="#fff" opacity=".3" transform="rotate(-20 36 28)"/><polygon points="36,28 36,72 72,50" fill="#fff" stroke="#fff" stroke-width="9" stroke-linejoin="round"/>`;

export const IconPlaySvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 96 104"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconPlay"}
    dangerouslySetInnerHTML={{ __html: svgIconPlaySvg }}
  />
);

const svgIconRedoSvg = `<defs><linearGradient id="IconRedoSvg.iconRedog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A98BD6"/><stop offset="1" stop-color="#7A55B3"/></linearGradient></defs><circle cx="48" cy="58" r="42" fill="#573A86"/><circle cx="48" cy="50" r="42" fill="url(#IconRedoSvg.iconRedog)"/><circle cx="48" cy="50" r="42" fill="none" stroke="#fff" stroke-width="4"/><ellipse cx="36" cy="28" rx="16" ry="6" fill="#fff" opacity=".3" transform="rotate(-20 36 28)"/><g transform="translate(96 0) scale(-1 1)"><path d="M34 38 H56 A15 15 0 0 1 56 68 H38" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><polygon points="38,24 20,38 38,52" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></g>`;

export const IconRedoSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 96 104"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconRedo"}
    dangerouslySetInnerHTML={{ __html: svgIconRedoSvg }}
  />
);

const svgIconScissorsSvg = `<defs><linearGradient id="IconScissorsSvg.iconScissorsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6CC3E6"/><stop offset="1" stop-color="#2F93C4"/></linearGradient></defs><circle cx="48" cy="58" r="42" fill="#1E6D96"/><circle cx="48" cy="50" r="42" fill="url(#IconScissorsSvg.iconScissorsg)"/><circle cx="48" cy="50" r="42" fill="none" stroke="#fff" stroke-width="4"/><ellipse cx="36" cy="28" rx="16" ry="6" fill="#fff" opacity=".3" transform="rotate(-20 36 28)"/><path d="M36 60 L62 26 M60 60 L34 26" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="36" cy="68" r="9" fill="none" stroke="#fff" stroke-width="6"/><circle cx="60" cy="68" r="9" fill="none" stroke="#fff" stroke-width="6"/><circle cx="48" cy="43" r="4" fill="#1E6D96"/>`;

export const IconScissorsSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 96 104"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconScissors"}
    dangerouslySetInnerHTML={{ __html: svgIconScissorsSvg }}
  />
);

const svgIconStopSvg = `<defs><linearGradient id="IconStopSvg.iconStopg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A7A"/><stop offset="1" stop-color="#E5483E"/></linearGradient></defs><circle cx="48" cy="58" r="42" fill="#A82A22"/><circle cx="48" cy="50" r="42" fill="url(#IconStopSvg.iconStopg)"/><circle cx="48" cy="50" r="42" fill="none" stroke="#fff" stroke-width="4"/><ellipse cx="36" cy="28" rx="16" ry="6" fill="#fff" opacity=".3" transform="rotate(-20 36 28)"/><rect x="30" y="30" width="36" height="36" rx="9" fill="#fff"/>`;

export const IconStopSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 96 104"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconStop"}
    dangerouslySetInnerHTML={{ __html: svgIconStopSvg }}
  />
);

const svgIconUndoSvg = `<defs><linearGradient id="IconUndoSvg.iconUndog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A98BD6"/><stop offset="1" stop-color="#7A55B3"/></linearGradient></defs><circle cx="48" cy="58" r="42" fill="#573A86"/><circle cx="48" cy="50" r="42" fill="url(#IconUndoSvg.iconUndog)"/><circle cx="48" cy="50" r="42" fill="none" stroke="#fff" stroke-width="4"/><ellipse cx="36" cy="28" rx="16" ry="6" fill="#fff" opacity=".3" transform="rotate(-20 36 28)"/><path d="M34 38 H56 A15 15 0 0 1 56 68 H38" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><polygon points="38,24 20,38 38,52" fill="#fff" stroke="#fff" stroke-width="4" stroke-linejoin="round"/>`;

export const IconUndoSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 96 104"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconUndo"}
    dangerouslySetInnerHTML={{ __html: svgIconUndoSvg }}
  />
);

const svgIconMergeClipsSvg = `<defs><linearGradient id="IconMergeClipsSvg.iconMergeClipsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8DF0B0"/><stop offset="1" stop-color="#2FBF71"/></linearGradient></defs><circle cx="48" cy="58" r="42" fill="#1B8A4F"/><circle cx="48" cy="50" r="42" fill="url(#IconMergeClipsSvg.iconMergeClipsg)"/><circle cx="48" cy="50" r="42" fill="none" stroke="#fff" stroke-width="4"/><ellipse cx="36" cy="28" rx="16" ry="6" fill="#fff" opacity=".3" transform="rotate(-20 36 28)"/><rect x="20" y="28" width="26" height="34" rx="8" fill="#fff"/><rect x="50" y="28" width="26" height="34" rx="8" fill="#fff"/><path d="M30 40 H36 M60 40 H66 M30 50 H36 M60 50 H66" stroke="#2FBF71" stroke-width="3.5" stroke-linecap="round"/><circle cx="48" cy="70" r="13" fill="#B8590C"/><circle cx="48" cy="67" r="13" fill="#FFCB45" stroke="#fff" stroke-width="3"/><path d="M48 60 V74 M41 67 H55" stroke="#8A3F0A" stroke-width="4" stroke-linecap="round"/>`;

export const IconMergeClipsSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 96 104"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconMergeClips"}
    dangerouslySetInnerHTML={{ __html: svgIconMergeClipsSvg }}
  />
);

const svgIconPlayHeadMarkerSvg = `<defs><linearGradient id="IconPlayHeadMarkerSvg.phm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFA060"/><stop offset="1" stop-color="#E2561A"/></linearGradient></defs><path d="M32 52 V114" stroke="#A63C0E" stroke-width="5" stroke-linecap="round" transform="translate(0 3)"/><path d="M14 14 H50 Q56 14 56 20 V36 L32 58 L8 36 V20 Q8 14 14 14Z" fill="#A63C0E" transform="translate(0 5)"/><path d="M14 8 H50 Q56 8 56 14 V32 L32 54 L8 32 V14 Q8 8 14 8Z" fill="url(#IconPlayHeadMarkerSvg.phm)" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M32 54 V114" stroke="#E2561A" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="116" r="8" fill="#A63C0E"/><circle cx="32" cy="113" r="8" fill="#F58A3A" stroke="#fff" stroke-width="3"/><ellipse cx="22" cy="18" rx="8" ry="3" fill="#fff" opacity=".45"/>`;

export const IconPlayHeadMarkerSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 64 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconPlayHeadMarker"}
    dangerouslySetInnerHTML={{ __html: svgIconPlayHeadMarkerSvg }}
  />
);

const svgIconCheckMarkSvg = `<defs></defs><path d="M18 54 L38 74 L78 28" fill="none" stroke="#fff" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 6)"/><path d="M18 54 L38 74 L78 28" fill="none" stroke="#1B8A4F" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 6)"/><path d="M18 54 L38 74 L78 28" fill="none" stroke="#fff" stroke-width="28" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 54 L38 74 L78 28" fill="none" stroke="#2FBF71" stroke-width="17" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 50 L38 66" fill="none" stroke="#8DF0B0" stroke-width="4" stroke-linecap="round"/>`;

export const IconCheckMarkSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 96 104"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconCheckMark"}
    dangerouslySetInnerHTML={{ __html: svgIconCheckMarkSvg }}
  />
);

const svgMonsterGolemSvg = `<defs><linearGradient id="MonsterGolemSvg.mgo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3E8F0"/><stop offset="1" stop-color="#AEB9CB"/></linearGradient></defs><ellipse cx="80" cy="146" rx="56" ry="8" fill="#000" opacity=".14"/><rect x="46" y="124" width="24" height="26" rx="10" fill="#6F7C92"/><rect x="90" y="124" width="24" height="26" rx="10" fill="#6F7C92"/><rect x="46" y="120" width="24" height="26" rx="10" fill="url(#MonsterGolemSvg.mgo)" stroke="#6F7C92" stroke-width="1.5"/><rect x="90" y="120" width="24" height="26" rx="10" fill="url(#MonsterGolemSvg.mgo)" stroke="#6F7C92" stroke-width="1.5"/><rect x="12" y="76" width="32" height="50" rx="16" fill="#6F7C92" transform="translate(0 4)"/><rect x="116" y="76" width="32" height="50" rx="16" fill="#6F7C92" transform="translate(0 4)"/><rect x="12" y="76" width="32" height="50" rx="16" fill="url(#MonsterGolemSvg.mgo)" stroke="#6F7C92" stroke-width="1.5"/><rect x="116" y="76" width="32" height="50" rx="16" fill="url(#MonsterGolemSvg.mgo)" stroke="#6F7C92" stroke-width="1.5"/><rect x="36" y="70" width="88" height="64" rx="24" fill="#6F7C92" transform="translate(0 5)"/><rect x="36" y="70" width="88" height="64" rx="24" fill="url(#MonsterGolemSvg.mgo)" stroke="#6F7C92" stroke-width="1.5"/><polygon points="80.0,91.0 84.2,99.8 93.0,104.0 84.2,108.2 80.0,117.0 75.8,108.2 67.0,104.0 75.8,99.8" fill="#FFB347" stroke="#E2561A" stroke-width="1.5" stroke-linejoin="round"/><rect x="48" y="26" width="64" height="56" rx="22" fill="#6F7C92" transform="translate(0 5)"/><rect x="48" y="26" width="64" height="56" rx="22" fill="url(#MonsterGolemSvg.mgo)" stroke="#6F7C92" stroke-width="1.5"/><ellipse cx="66" cy="38" rx="12" ry="5" fill="#fff" opacity=".4" transform="rotate(-20 66 38)"/><ellipse cx="66" cy="56" rx="9" ry="10" fill="#FFF3B0" stroke="#E2561A" stroke-width="1.5"/><ellipse cx="94" cy="56" rx="9" ry="10" fill="#FFF3B0" stroke="#E2561A" stroke-width="1.5"/><circle cx="67" cy="58" r="4.5" fill="#E2561A"/><circle cx="95" cy="58" r="4.5" fill="#E2561A"/><path d="M70 72 Q80 80 90 72" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><circle cx="54" cy="68" r="5" fill="#F58A8A" opacity=".5"/><circle cx="106" cy="68" r="5" fill="#F58A8A" opacity=".5"/><path d="M44 80 C52 74 62 76 64 84 C58 90 46 90 44 80Z" fill="#6FAE63" stroke="#2D5A27" stroke-width="1.2"/><path d="M100 124 C108 118 118 120 120 128 C114 134 102 134 100 124Z" fill="#6FAE63" stroke="#2D5A27" stroke-width="1.2"/><path d="M116 40 C124 30 134 34 132 42 C128 48 118 48 116 40Z" fill="#6FAE63" stroke="#2D5A27" stroke-width="1.2" transform="translate(-12 -2)"/>`;

export const MonsterGolemSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "monsterGolem"}
    dangerouslySetInnerHTML={{ __html: svgMonsterGolemSvg }}
  />
);

const svgMonsterPixelSvg = `<defs><linearGradient id="MonsterPixelSvg.mpx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9AEF0"/><stop offset="1" stop-color="#8F6BC4"/></linearGradient></defs><ellipse cx="80" cy="140" rx="52" ry="7" fill="#000" opacity=".14"/><rect x="38" y="32" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="110" y="32" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="50" y="44" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="98" y="44" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="38" y="56" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="50" y="56" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="62" y="56" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="74" y="56" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="86" y="56" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="98" y="56" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="110" y="56" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="26" y="68" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="38" y="68" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="62" y="68" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="74" y="68" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="86" y="68" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="110" y="68" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="122" y="68" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="14" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="26" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="38" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="50" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="62" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="74" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="86" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="98" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="110" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="122" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="134" y="80" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="14" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="38" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="50" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="62" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="74" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="86" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="98" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="110" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="134" y="92" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="14" y="104" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="38" y="104" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="110" y="104" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="134" y="104" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="50" y="116" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="62" y="116" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="86" y="116" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="98" y="116" width="12" height="12" rx="3.5" fill="#573A86"/><rect x="38" y="28" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="110" y="28" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="50" y="40" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="98" y="40" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="38" y="52" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="50" y="52" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="62" y="52" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="74" y="52" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="86" y="52" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="98" y="52" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="110" y="52" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="26" y="64" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="38" y="64" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="62" y="64" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="74" y="64" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="86" y="64" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="110" y="64" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="122" y="64" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="14" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="26" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="38" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="50" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="62" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="74" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="86" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="98" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="110" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="122" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="134" y="76" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="14" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="38" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="50" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="62" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="74" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="86" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="98" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="110" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="134" y="88" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="14" y="100" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="38" y="100" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="110" y="100" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="134" y="100" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="50" y="112" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="62" y="112" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="86" y="112" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="98" y="112" width="12" height="12" rx="3.5" fill="url(#MonsterPixelSvg.mpx)" stroke="#573A86" stroke-width="1"/><rect x="49" y="63" width="14" height="14" rx="4" fill="#fff" stroke="#573A86" stroke-width="1.2"/><rect x="54" y="68" width="6" height="7" rx="2.5" fill="#3E2518"/><rect x="97" y="63" width="14" height="14" rx="4" fill="#fff" stroke="#573A86" stroke-width="1.2"/><rect x="102" y="68" width="6" height="7" rx="2.5" fill="#3E2518"/><rect x="38" y="76" width="12" height="12" rx="3.5" fill="#F58AAE" opacity=".8"/><rect x="110" y="76" width="12" height="12" rx="3.5" fill="#F58AAE" opacity=".8"/><rect x="66" y="80" width="28" height="4" rx="2" fill="#3E2518" opacity="0"/><path transform="translate(136 36) scale(1.2)" opacity="1" fill="#A98BD6" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(26 52) scale(1)" opacity="1" fill="#A98BD6" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/>`;

export const MonsterPixelSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "monsterPixel"}
    dangerouslySetInnerHTML={{ __html: svgMonsterPixelSvg }}
  />
);

const svgMonsterSlimeSvg = `<defs><linearGradient id="MonsterSlimeSvg.msl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CF2B8"/><stop offset="1" stop-color="#34C77B"/></linearGradient></defs><ellipse cx="80" cy="140" rx="56" ry="8" fill="#000" opacity=".14"/><path d="M24 130 C12 98 34 54 80 54 C126 54 148 98 136 130 C130 144 30 144 24 130Z" fill="#1B8A4F" transform="translate(0 5)"/><path d="M24 130 C12 98 34 54 80 54 C126 54 148 98 136 130 C130 144 30 144 24 130Z" fill="url(#MonsterSlimeSvg.msl)" stroke="#1B8A4F" stroke-width="1.5"/><ellipse cx="54" cy="76" rx="14" ry="7" fill="#fff" opacity=".4" transform="rotate(-30 54 76)"/><path d="M80 54 C78 40 86 30 98 28 C98 40 92 50 80 54Z" fill="#5E9470" stroke="#2D5A27" stroke-width="1.5"/><circle cx="62" cy="96" r="14" fill="#fff" stroke="#1B8A4F" stroke-width="1.5"/><circle cx="98" cy="96" r="14" fill="#fff" stroke="#1B8A4F" stroke-width="1.5"/><circle cx="64" cy="98" r="7" fill="#3E2518"/><circle cx="100" cy="98" r="7" fill="#3E2518"/><circle cx="66" cy="95" r="2.4" fill="#fff"/><circle cx="102" cy="95" r="2.4" fill="#fff"/><path d="M70 116 Q80 126 90 116" fill="none" stroke="#1B8A4F" stroke-width="3.5" stroke-linecap="round"/><circle cx="46" cy="112" r="6" fill="#F58A8A" opacity=".55"/><circle cx="114" cy="112" r="6" fill="#F58A8A" opacity=".55"/><circle cx="30" cy="132" r="5" fill="#8DF0B0" opacity=".8"/><circle cx="132" cy="134" r="4" fill="#8DF0B0" opacity=".8"/>`;

export const MonsterSlimeSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "monsterSlime"}
    dangerouslySetInnerHTML={{ __html: svgMonsterSlimeSvg }}
  />
);

const svgAvatarBoySvg = `<defs><linearGradient id="AvatarBoySvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="AvatarBoySvg.hjq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9A0E0"/><stop offset="1" stop-color="#7A55B3"/></linearGradient><linearGradient id="AvatarBoySvg.cps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58A3A"/><stop offset="1" stop-color="#E2561A"/></linearGradient><linearGradient id="AvatarBoySvg.avatarBoybg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F7F1"/><stop offset="1" stop-color="#9ADBC7"/></linearGradient><linearGradient id="AvatarBoySvg.avatarBoysh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient></defs><circle cx="64" cy="76" r="52" fill="#B8590C"/><circle cx="64" cy="70" r="52" fill="url(#AvatarBoySvg.avatarBoybg)" stroke="#F29A12" stroke-width="6"/><path d="M24 114 C28 92 44 88 64 88 C84 88 100 92 104 114 C92 126 36 126 24 114Z" fill="url(#AvatarBoySvg.avatarBoysh)" stroke="#2A7A68" stroke-width="1.5"/><rect x="55" y="82" width="18" height="12" rx="5" fill="#F2B88A"/><g transform="translate(64 64) scale(.74)"><circle cx="-36" cy="4" r="8" fill="#F2B88A"/><circle cx="36" cy="4" r="8" fill="#F2B88A"/><circle cx="0" cy="0" r="36" fill="url(#AvatarBoySvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-37 -10 C-37 -52 37 -52 37 -10 C25 -22 -25 -22 -37 -10Z" fill="#fff" stroke="#C9B79A" stroke-width="1.5"/><rect x="-37" y="-17" width="74" height="10" rx="5" fill="#F3E6D3" stroke="#C9B79A" stroke-width="1.2"/><path d="M-6 -42 L0 -50 L6 -42" fill="none" stroke="#FFCB45" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="-13" cy="4" r="4.5" fill="#3E2518"/><circle cx="13" cy="4" r="4.5" fill="#3E2518"/><circle cx="-11.5" cy="2.5" r="1.4" fill="#fff"/><circle cx="14.5" cy="2.5" r="1.4" fill="#fff"/><circle cx="-24" cy="16" r="6" fill="#F58A8A" opacity=".5"/><circle cx="24" cy="16" r="6" fill="#F58A8A" opacity=".5"/><path d="M-9 17 Q0 27 9 17" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/></g>`;

export const AvatarBoySvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 140"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "avatarBoy"}
    dangerouslySetInnerHTML={{ __html: svgAvatarBoySvg }}
  />
);

const svgAvatarQirraSvg = `<defs><linearGradient id="AvatarQirraSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="AvatarQirraSvg.hjq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9A0E0"/><stop offset="1" stop-color="#7A55B3"/></linearGradient><linearGradient id="AvatarQirraSvg.cps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58A3A"/><stop offset="1" stop-color="#E2561A"/></linearGradient><linearGradient id="AvatarQirraSvg.avatarQirrabg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EAFB"/><stop offset="1" stop-color="#D3BEF0"/></linearGradient><linearGradient id="AvatarQirraSvg.avatarQirrash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9B3EA"/><stop offset="1" stop-color="#8F6BC4"/></linearGradient></defs><circle cx="64" cy="76" r="52" fill="#B8590C"/><circle cx="64" cy="70" r="52" fill="url(#AvatarQirraSvg.avatarQirrabg)" stroke="#A98BD6" stroke-width="6"/><path d="M24 114 C28 92 44 88 64 88 C84 88 100 92 104 114 C92 126 36 126 24 114Z" fill="url(#AvatarQirraSvg.avatarQirrash)" stroke="#573A86" stroke-width="1.5"/><rect x="55" y="82" width="18" height="12" rx="5" fill="#F2B88A"/><g transform="translate(64 64) scale(.74)"><path d="M-46 8 C-50 -46 -24 -58 0 -58 C24 -58 50 -46 46 8 C48 34 32 52 0 56 C-32 52 -48 34 -46 8Z" fill="url(#AvatarQirraSvg.hjq)" stroke="#573A86" stroke-width="1.5"/><circle cx="0" cy="4" r="33" fill="url(#AvatarQirraSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-33 -4 C-33 -32 -16 -40 0 -40 C16 -40 33 -32 33 -4 C22 -20 -22 -20 -33 -4Z" fill="url(#AvatarQirraSvg.hjq)" stroke="#573A86" stroke-width="1.5"/><circle cx="-13" cy="6" r="10" fill="#fff" fill-opacity=".35" stroke="#5A3A2A" stroke-width="2.5"/><circle cx="13" cy="6" r="10" fill="#fff" fill-opacity=".35" stroke="#5A3A2A" stroke-width="2.5"/><path d="M-3 5 H3" stroke="#5A3A2A" stroke-width="2.5"/><circle cx="-13" cy="6" r="3.8" fill="#3E2518"/><circle cx="13" cy="6" r="3.8" fill="#3E2518"/><circle cx="-24" cy="20" r="5.5" fill="#F58A8A" opacity=".5"/><circle cx="24" cy="20" r="5.5" fill="#F58A8A" opacity=".5"/><path d="M-8 22 Q0 30 8 22" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><polygon points="26.0,-33.0 27.9,-28.6 32.7,-28.2 29.0,-25.0 30.1,-20.3 26.0,-22.8 21.9,-20.3 23.0,-25.0 19.3,-28.2 24.1,-28.6" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/></g>`;

export const AvatarQirraSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 140"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "avatarQirra"}
    dangerouslySetInnerHTML={{ __html: svgAvatarQirraSvg }}
  />
);

const svgBuildingRumahSvg = `<defs><linearGradient id="BuildingRumahSvg.brw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8EE"/><stop offset="1" stop-color="#FBE3C0"/></linearGradient><linearGradient id="BuildingRumahSvg.brr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58AAE"/><stop offset="1" stop-color="#D14E7C"/></linearGradient></defs><ellipse cx="80" cy="148" rx="64" ry="8" fill="#000" opacity=".14"/><rect x="32" y="84" width="96" height="66" rx="10" fill="#E8B060"/><rect x="32" y="78" width="96" height="66" rx="10" fill="url(#BuildingRumahSvg.brw)" stroke="#D9993D" stroke-width="1.5"/><rect x="100" y="48" width="14" height="30" rx="4" fill="#8A5A44"/><path d="M20 84 L80 38 L140 84Z" fill="#9E2E55" stroke="#9E2E55" stroke-width="6" stroke-linejoin="round" transform="translate(0 4)"/><path d="M20 84 L80 38 L140 84Z" fill="url(#BuildingRumahSvg.brr)" stroke="#9E2E55" stroke-width="3" stroke-linejoin="round"/><rect x="42" y="96" width="26" height="26" rx="8" fill="#BFE7F7" stroke="#2F93C4" stroke-width="2"/><path d="M55 96 V122 M42 109 H68" stroke="#fff" stroke-width="2"/><path d="M86 144 V114 C86 100 110 100 110 114 V144Z" fill="#5A3A2A"/><path d="M90 144 V116 C90 106 106 106 106 116 V144Z" fill="#2D5A27" stroke="#FFCB45" stroke-width="1.2"/><path d="M64 112 C16 78 10 42 36 28 C52 20 62 30 64 40 C66 30 76 20 92 28 C118 42 112 78 64 112Z" fill="#fff" transform="translate(72 52) scale(.12)"/>`;

export const BuildingRumahSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "buildingRumah"}
    dangerouslySetInnerHTML={{ __html: svgBuildingRumahSvg }}
  />
);

const svgBuildingKelasSvg = `<defs><linearGradient id="BuildingKelasSvg.bkw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFEBD9"/><stop offset="1" stop-color="#FBCFA8"/></linearGradient><linearGradient id="BuildingKelasSvg.bkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FAE63"/><stop offset="1" stop-color="#2D5A27"/></linearGradient><linearGradient id="BuildingKelasSvg.bkd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58A3A"/><stop offset="1" stop-color="#E2561A"/></linearGradient></defs><ellipse cx="80" cy="148" rx="64" ry="8" fill="#000" opacity=".14"/><rect x="22" y="78" width="116" height="72" rx="10" fill="#E8A97A"/><rect x="22" y="72" width="116" height="72" rx="10" fill="url(#BuildingKelasSvg.bkw)" stroke="#D98A55" stroke-width="1.5"/><rect x="62" y="40" width="36" height="40" rx="8" fill="url(#BuildingKelasSvg.bkw)" stroke="#D98A55" stroke-width="1.5"/><rect x="14" y="60" width="132" height="20" rx="9" fill="#1B3A17" transform="translate(0 4)"/><rect x="14" y="60" width="132" height="20" rx="9" fill="url(#BuildingKelasSvg.bkg)" stroke="#1B3A17" stroke-width="1.5"/><path d="M60 44 C60 26 100 26 100 44Z" fill="url(#BuildingKelasSvg.bkg)" stroke="#1B3A17" stroke-width="1.5"/><path d="M86 12 A9 9 0 1 0 86 28 A7 7 0 1 1 86 12Z" fill="#FFCB45" stroke="#B8590C" stroke-width="1" transform="translate(-4 -2)"/><circle cx="80" cy="56" r="11" fill="#fff" stroke="#C28A0E" stroke-width="2"/><path d="M80 56 V49 M80 56 L85 59" stroke="#5A3A2A" stroke-width="2" stroke-linecap="round"/><rect x="32" y="92" width="26" height="28" rx="8" fill="#BFE7F7" stroke="#2F93C4" stroke-width="1.5"/><path d="M45 92 V120 M32 106 H58" stroke="#fff" stroke-width="2"/><rect x="102" y="92" width="26" height="28" rx="8" fill="#BFE7F7" stroke="#2F93C4" stroke-width="1.5"/><path d="M115 92 V120 M102 106 H128" stroke="#fff" stroke-width="2"/><path d="M66 144 V114 C66 98 94 98 94 114 V144Z" fill="#A63C0E"/><path d="M70 144 V116 C70 104 90 104 90 116 V144Z" fill="url(#BuildingKelasSvg.bkd)" stroke="#FFCB45" stroke-width="1.5"/><path d="M80 106 V144" stroke="#A63C0E" stroke-width="1.5"/>`;

export const BuildingKelasSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "buildingKelas"}
    dangerouslySetInnerHTML={{ __html: svgBuildingKelasSvg }}
  />
);

const svgBuildingMasjidSvg = `<defs><linearGradient id="BuildingMasjidSvg.bmw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#F3E6D3"/></linearGradient><linearGradient id="BuildingMasjidSvg.bmg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FAE63"/><stop offset="1" stop-color="#2D5A27"/></linearGradient></defs><ellipse cx="80" cy="148" rx="64" ry="8" fill="#000" opacity=".14"/><rect x="36" y="88" width="88" height="62" rx="8" fill="#D9C4A0"/><rect x="36" y="82" width="88" height="62" rx="8" fill="url(#BuildingMasjidSvg.bmw)" stroke="#C9A87A" stroke-width="1.5"/><rect x="14" y="58" width="20" height="92" rx="6" fill="#D9C4A0"/><rect x="14" y="52" width="20" height="92" rx="6" fill="url(#BuildingMasjidSvg.bmw)" stroke="#C9A87A" stroke-width="1.5"/><path d="M11 54 L24 28 L37 54Z" fill="url(#BuildingMasjidSvg.bmg)" stroke="#1B3A17" stroke-width="1.5" stroke-linejoin="round"/><circle cx="24" cy="25" r="4" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M19 84 V74 C19 66 29 66 29 74 V84Z" fill="#FFCB45"/><rect x="126" y="58" width="20" height="92" rx="6" fill="#D9C4A0"/><rect x="126" y="52" width="20" height="92" rx="6" fill="url(#BuildingMasjidSvg.bmw)" stroke="#C9A87A" stroke-width="1.5"/><path d="M123 54 L136 28 L149 54Z" fill="url(#BuildingMasjidSvg.bmg)" stroke="#1B3A17" stroke-width="1.5" stroke-linejoin="round"/><circle cx="136" cy="25" r="4" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M131 84 V74 C131 66 141 66 141 74 V84Z" fill="#FFCB45"/><path d="M54 84 C54 38 106 38 106 84Z" fill="#1B3A17" transform="translate(0 4)"/><path d="M54 84 C54 38 106 38 106 84Z" fill="url(#BuildingMasjidSvg.bmg)" stroke="#1B3A17" stroke-width="1.5"/><ellipse cx="68" cy="56" rx="9" ry="5" fill="#fff" opacity=".3" transform="rotate(-35 68 56)"/><rect x="78.5" y="26" width="3" height="16" fill="#C28A0E"/><path d="M86 18 A9 9 0 1 0 86 34 A7 7 0 1 1 86 18Z" fill="#FFCB45" stroke="#B8590C" stroke-width="1" transform="translate(-6 -2)"/><path d="M66 146 V120 C66 102 94 102 94 120 V146Z" fill="#1B3A17"/><path d="M71 146 V122 C71 110 89 110 89 122 V146Z" fill="#2D5A27" stroke="#FFCB45" stroke-width="1.5"/><path d="M44 130 V116 C44 108 58 108 58 116 V130Z" fill="#FFCB45" stroke="#C28A0E" stroke-width="1.2"/><path d="M102 130 V116 C102 108 116 108 116 116 V130Z" fill="#FFCB45" stroke="#C28A0E" stroke-width="1.2"/><rect x="58" y="144" width="44" height="6" rx="3" fill="#D9C4A0"/>`;

export const BuildingMasjidSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "buildingMasjid"}
    dangerouslySetInnerHTML={{ __html: svgBuildingMasjidSvg }}
  />
);

const svgBuildingDapurSvg = `<defs><linearGradient id="BuildingDapurSvg.bdw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1D0"/><stop offset="1" stop-color="#FFD9A0"/></linearGradient><linearGradient id="BuildingDapurSvg.bdr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58A3A"/><stop offset="1" stop-color="#E2561A"/></linearGradient></defs><ellipse cx="80" cy="148" rx="64" ry="8" fill="#000" opacity=".14"/><rect x="30" y="84" width="100" height="66" rx="10" fill="#E8B060"/><rect x="30" y="78" width="100" height="66" rx="10" fill="url(#BuildingDapurSvg.bdw)" stroke="#D9993D" stroke-width="1.5"/><rect x="106" y="42" width="16" height="36" rx="4" fill="#A63C0E"/><rect x="103" y="38" width="22" height="8" rx="4" fill="#E2561A" stroke="#A63C0E" stroke-width="1.2"/><circle cx="116" cy="34" r="7" fill="#fff" opacity=".85"><animate attributeName="cy" values="34;20" dur="2.4s" begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" values=".85;0" dur="2.4s" begin="0s" repeatCount="indefinite"/></circle><circle cx="122" cy="24" r="9" fill="#fff" opacity=".85"><animate attributeName="cy" values="24;10" dur="2.4s" begin="0.8s" repeatCount="indefinite"/><animate attributeName="opacity" values=".85;0" dur="2.4s" begin="0.8s" repeatCount="indefinite"/></circle><circle cx="115" cy="14" r="10" fill="#fff" opacity=".85"><animate attributeName="cy" values="14;0" dur="2.4s" begin="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".85;0" dur="2.4s" begin="1.6s" repeatCount="indefinite"/></circle><path d="M20 84 L80 44 L140 84Z" fill="#A63C0E" stroke="#A63C0E" stroke-width="6" stroke-linejoin="round" transform="translate(0 4)"/><path d="M20 84 L80 44 L140 84Z" fill="url(#BuildingDapurSvg.bdr)" stroke="#A63C0E" stroke-width="3" stroke-linejoin="round"/><rect x="40" y="94" width="38" height="32" rx="9" fill="#FFE27A" stroke="#8A5A44" stroke-width="3"/><path d="M48 112 H70 C70 122 48 122 48 112Z" fill="#fff" stroke="#8A5A44" stroke-width="1.5"/><path d="M54 108 q-3 -5 0 -9 M60 108 q-3 -5 0 -9 M66 108 q-3 -5 0 -9" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".9"/><path d="M94 144 V112 C94 100 114 100 114 112 V144Z" fill="#5A3A2A"/><path d="M98 144 V114 C98 106 110 106 110 114 V144Z" fill="#8A5A44"/><ellipse cx="22" cy="140" rx="12" ry="9" fill="#5A3A2A"/><ellipse cx="22" cy="134" rx="12" ry="6" fill="#8E9AAD" stroke="#5A3A2A" stroke-width="1.2"/>`;

export const BuildingDapurSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "buildingDapur"}
    dangerouslySetInnerHTML={{ __html: svgBuildingDapurSvg }}
  />
);

const svgBuildingPerpusSvg = `<defs><linearGradient id="BuildingPerpusSvg.bpw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2FAEE"/><stop offset="1" stop-color="#CFE5C4"/></linearGradient><linearGradient id="BuildingPerpusSvg.bpg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FAE63"/><stop offset="1" stop-color="#2D5A27"/></linearGradient></defs><ellipse cx="80" cy="148" rx="64" ry="8" fill="#000" opacity=".14"/><rect x="24" y="80" width="112" height="70" rx="8" fill="#9CC48C"/><rect x="24" y="74" width="112" height="70" rx="8" fill="url(#BuildingPerpusSvg.bpw)" stroke="#7FA96F" stroke-width="1.5"/><path d="M14 78 L80 30 L146 78Z" fill="#1B3A17" stroke="#1B3A17" stroke-width="6" stroke-linejoin="round" transform="translate(0 4)"/><path d="M14 78 L80 30 L146 78Z" fill="url(#BuildingPerpusSvg.bpg)" stroke="#1B3A17" stroke-width="3" stroke-linejoin="round"/><circle cx="80" cy="56" r="10" fill="#FFCB45" stroke="#B8590C" stroke-width="1.5"/><path d="M80 60 C76 56 72 56 69 57 V63 C72 62 76 62 80 65 C84 62 88 62 91 63 V57 C88 56 84 56 80 60Z" fill="#fff" transform="translate(0 -3) scale(1)"/><rect x="28" y="82" width="10" height="62" rx="4" fill="#FFFDF7" stroke="#C9A87A" stroke-width="1.2"/><rect x="122" y="82" width="10" height="62" rx="4" fill="#FFFDF7" stroke="#C9A87A" stroke-width="1.2"/><rect x="58" y="86" width="44" height="26" rx="9" fill="#FFCB45" stroke="#C28A0E" stroke-width="1.5"/><path d="M80 105 V98 M70 98 C73 94 77 94 80 98 C83 94 87 94 90 98 V102 C87 100 83 100 80 103 C77 100 73 100 70 102Z" fill="#fff" stroke="#B8590C" stroke-width="1" stroke-linejoin="round"/><path d="M72 108 L80 100 L88 108" fill="none" stroke="#8A3F0A" stroke-width="2" stroke-linecap="round" opacity="0"/><path d="M40 128 V102 C40 92 54 92 54 102 V128Z" fill="#BFE7F7" stroke="#2F93C4" stroke-width="1.5"/><path d="M106 128 V102 C106 92 120 92 120 102 V128Z" fill="#BFE7F7" stroke="#2F93C4" stroke-width="1.5"/><path d="M66 144 V122 C66 112 94 112 94 122 V144Z" fill="url(#BuildingPerpusSvg.bpg)" stroke="#1B3A17" stroke-width="1.5"/>`;

export const BuildingPerpusSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "buildingPerpus"}
    dangerouslySetInnerHTML={{ __html: svgBuildingPerpusSvg }}
  />
);

const svgBuildingAsramaSvg = `<defs><linearGradient id="BuildingAsramaSvg.baw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0A478"/><stop offset="1" stop-color="#B9794E"/></linearGradient><linearGradient id="BuildingAsramaSvg.bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58A3A"/><stop offset="1" stop-color="#E2561A"/></linearGradient></defs><ellipse cx="80" cy="148" rx="64" ry="8" fill="#000" opacity=".14"/><rect x="26" y="84" width="108" height="66" rx="8" fill="#8A5A44"/><rect x="26" y="78" width="108" height="66" rx="8" fill="url(#BuildingAsramaSvg.baw)" stroke="#8A5A44" stroke-width="1.5"/><path d="M26 92 H134" stroke="#8A5A44" stroke-width="1.5" opacity=".35"/><path d="M26 104 H134" stroke="#8A5A44" stroke-width="1.5" opacity=".35"/><path d="M26 116 H134" stroke="#8A5A44" stroke-width="1.5" opacity=".35"/><path d="M26 128 H134" stroke="#8A5A44" stroke-width="1.5" opacity=".35"/><path d="M26 140 H134" stroke="#8A5A44" stroke-width="1.5" opacity=".35"/><path d="M14 84 L80 32 L146 84Z" fill="#A63C0E" stroke="#A63C0E" stroke-width="6" stroke-linejoin="round" transform="translate(0 4)"/><path d="M14 84 L80 32 L146 84Z" fill="url(#BuildingAsramaSvg.bar)" stroke="#A63C0E" stroke-width="3" stroke-linejoin="round"/><path d="M24 78 L80 40" stroke="#fff" stroke-width="3" opacity=".25" stroke-linecap="round"/><circle cx="80" cy="62" r="11" fill="#FFE27A" stroke="#8A5A44" stroke-width="3"/><path d="M80 51 V73 M69 62 H91" stroke="#8A5A44" stroke-width="2"/><path d="M86 14 A8 8 0 1 0 86 28 A6 6 0 1 1 86 14Z" fill="#FFCB45" stroke="#B8590C" stroke-width="1" transform="translate(-5 4)"/><rect x="36" y="94" width="26" height="28" rx="8" fill="#FFE27A" stroke="#6B4634" stroke-width="3"/><path d="M49 94 V122 M36 108 H62" stroke="#6B4634" stroke-width="2"/><path d="M34 92 q8 12 4 28 M64 92 q-8 12 -4 28" stroke="#F58A3A" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="98" y="94" width="26" height="28" rx="8" fill="#FFE27A" stroke="#6B4634" stroke-width="3"/><path d="M111 94 V122 M98 108 H124" stroke="#6B4634" stroke-width="2"/><path d="M96 92 q8 12 4 28 M126 92 q-8 12 -4 28" stroke="#F58A3A" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M66 144 V116 C66 102 94 102 94 116 V144Z" fill="#5A3A2A"/><path d="M71 144 V118 C71 108 89 108 89 118 V144Z" fill="#8A5A44" stroke="#FFCB45" stroke-width="1.2"/><circle cx="85" cy="130" r="2" fill="#FFCB45"/>`;

export const BuildingAsramaSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "buildingAsrama"}
    dangerouslySetInnerHTML={{ __html: svgBuildingAsramaSvg }}
  />
);

const svgMapGerbangSvg = `<defs><linearGradient id="MapGerbangSvg.mgw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF7"/><stop offset="1" stop-color="#F3E6D3"/></linearGradient><linearGradient id="MapGerbangSvg.mgg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FAE63"/><stop offset="1" stop-color="#2D5A27"/></linearGradient></defs><ellipse cx="80" cy="150" rx="68" ry="9" fill="#9CC48C"/><path d="M60 150 L100 150 L112 160 L48 160Z" fill="#E9D9C0"/><ellipse cx="80" cy="150" rx="64" ry="5" fill="#000" opacity=".14"/><rect x="14" y="64" width="28" height="88" rx="8" fill="#D9C4A0"/><rect x="14" y="58" width="28" height="88" rx="8" fill="url(#MapGerbangSvg.mgw)" stroke="#C9A87A" stroke-width="1.5"/><path d="M10 62 C10 34 46 34 46 62Z" fill="url(#MapGerbangSvg.mgg)" stroke="#1B3A17" stroke-width="1.5"/><circle cx="28" cy="30" r="4.5" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M20 96 V86 C20 78 36 78 36 86 V96Z" fill="#FFCB45" stroke="#C28A0E" stroke-width="1"/><rect x="118" y="64" width="28" height="88" rx="8" fill="#D9C4A0"/><rect x="118" y="58" width="28" height="88" rx="8" fill="url(#MapGerbangSvg.mgw)" stroke="#C9A87A" stroke-width="1.5"/><path d="M114 62 C114 34 150 34 150 62Z" fill="url(#MapGerbangSvg.mgg)" stroke="#1B3A17" stroke-width="1.5"/><circle cx="132" cy="30" r="4.5" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M124 96 V86 C124 78 140 78 140 86 V96Z" fill="#FFCB45" stroke="#C28A0E" stroke-width="1"/><path d="M42 90 C42 50 118 50 118 90" fill="none" stroke="#1B3A17" stroke-width="12" stroke-linecap="round"/><path d="M42 90 C42 50 118 50 118 90" fill="none" stroke="url(#MapGerbangSvg.mgg)" stroke-width="8" stroke-linecap="round"/><path d="M56 84 V148" stroke="#1B3A17" stroke-width="5" stroke-linecap="round"/><circle cx="56" cy="82" r="4.5" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M68 84 V148" stroke="#1B3A17" stroke-width="5" stroke-linecap="round"/><circle cx="68" cy="82" r="4.5" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M80 84 V148" stroke="#1B3A17" stroke-width="5" stroke-linecap="round"/><circle cx="80" cy="82" r="4.5" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M92 84 V148" stroke="#1B3A17" stroke-width="5" stroke-linecap="round"/><circle cx="92" cy="82" r="4.5" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M104 84 V148" stroke="#1B3A17" stroke-width="5" stroke-linecap="round"/><circle cx="104" cy="82" r="4.5" fill="#FFCB45" stroke="#B8590C" stroke-width="1"/><path d="M42 148 H118" stroke="#1B3A17" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="58" r="15" fill="#B8590C"/><circle cx="80" cy="55" r="15" fill="#FFCB45" stroke="#B8590C" stroke-width="1.5"/><path d="M84 46 A10 10 0 1 0 86 64 A8 8 0 1 1 84 46Z" fill="#2D5A27"/>`;

export const MapGerbangSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "mapGerbang"}
    dangerouslySetInnerHTML={{ __html: svgMapGerbangSvg }}
  />
);

const svgMapLapanganSvg = `<defs><linearGradient id="MapLapanganSvg.mlg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FC472"/><stop offset="1" stop-color="#4E9A45"/></linearGradient></defs><rect x="10" y="36" width="140" height="112" rx="26" fill="#2D5A27"/><clipPath id="MapLapanganSvg.mlc"><rect x="10" y="26" width="140" height="112" rx="26"/></clipPath><rect x="10" y="26" width="140" height="112" rx="26" fill="url(#MapLapanganSvg.mlg)"/><g clip-path="url(#MapLapanganSvg.mlc)"><rect x="10" y="26" width="14" height="116" fill="#fff" opacity=".1"/><rect x="38" y="26" width="14" height="116" fill="#fff" opacity=".1"/><rect x="66" y="26" width="14" height="116" fill="#fff" opacity=".1"/><rect x="94" y="26" width="14" height="116" fill="#fff" opacity=".1"/><rect x="122" y="26" width="14" height="116" fill="#fff" opacity=".1"/></g><rect x="10" y="26" width="140" height="112" rx="26" fill="none" stroke="#1B3A17" stroke-width="1.5"/><g fill="none" stroke="#fff" stroke-width="3" opacity=".9"><rect x="26" y="42" width="108" height="80" rx="10"/><path d="M80 42 V122"/><circle cx="80" cy="82" r="16"/><rect x="26" y="64" width="16" height="36"/><rect x="118" y="64" width="16" height="36"/></g><circle cx="104" cy="96" r="10" fill="#B8590C" opacity=".5"/><circle cx="104" cy="92" r="10" fill="#fff" stroke="#5A3A2A" stroke-width="1.5"/><path d="M104 87 L108 91 L106 96 H102 L100 91Z" fill="#5A3A2A"/><polygon points="52,134 46,150 58,150" fill="#F58A3A" stroke="#A63C0E" stroke-width="1.5" stroke-linejoin="round"/>`;

export const MapLapanganSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "mapLapangan"}
    dangerouslySetInnerHTML={{ __html: svgMapLapanganSvg }}
  />
);

const svgMapRuangTamuSvg = `<defs><linearGradient id="MapRuangTamuSvg.mtg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F58AAE"/><stop offset="1" stop-color="#D14E7C"/></linearGradient></defs><ellipse cx="80" cy="138" rx="66" ry="12" fill="#A98BD6"/><ellipse cx="80" cy="134" rx="66" ry="12" fill="#CDB8EC" stroke="#7A55B3" stroke-width="1.5"/><rect x="116" y="54" width="6" height="74" rx="3" fill="#8A5A44"/><path d="M104 54 L112 28 H126 L134 54Z" fill="#FFE27A" stroke="#C28A0E" stroke-width="1.5" stroke-linejoin="round"/><rect x="108" y="124" width="22" height="7" rx="3.5" fill="#5A3A2A"/><rect x="14" y="62" width="100" height="40" rx="18" fill="#9E2E55"/><rect x="14" y="56" width="100" height="40" rx="18" fill="url(#MapRuangTamuSvg.mtg)" stroke="#9E2E55" stroke-width="1.5"/><rect x="8" y="76" width="22" height="46" rx="11" fill="#D14E7C" stroke="#9E2E55" stroke-width="1.5"/><rect x="98" y="76" width="22" height="46" rx="11" fill="#D14E7C" stroke="#9E2E55" stroke-width="1.5"/><rect x="26" y="88" width="76" height="32" rx="14" fill="url(#MapRuangTamuSvg.mtg)" stroke="#9E2E55" stroke-width="1.5"/><rect x="36" y="62" width="22" height="22" rx="8" fill="#FFE27A" stroke="#C28A0E" stroke-width="1.2" transform="rotate(-8 47 73)"/><rect x="20" y="122" width="10" height="12" rx="4" fill="#5A3A2A"/><rect x="98" y="122" width="10" height="12" rx="4" fill="#5A3A2A"/><rect x="48" y="24" width="36" height="26" rx="6" fill="#FFF8EE" stroke="#C28A0E" stroke-width="3"/><path d="M54 44 L62 34 L68 41 L73 36 L80 44Z" fill="#7FB08C"/><path transform="translate(140 90) scale(0.8)" opacity="1" fill="#FFCB45" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/>`;

export const MapRuangTamuSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "mapRuangTamu"}
    dangerouslySetInnerHTML={{ __html: svgMapRuangTamuSvg }}
  />
);

const svgMapTamanSvg = `<defs><linearGradient id="MapTamanSvg.mmg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD080"/><stop offset="1" stop-color="#4E9A45"/></linearGradient><linearGradient id="MapTamanSvg.mmw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9996B"/><stop offset="1" stop-color="#B9794E"/></linearGradient></defs><ellipse cx="80" cy="136" rx="70" ry="14" fill="#4E9A45"/><ellipse cx="80" cy="132" rx="70" ry="14" fill="url(#MapTamanSvg.mmg1)" stroke="#2D5A27" stroke-width="1.5"/><rect x="30" y="56" width="10" height="52" rx="4" fill="#6B4634" transform="translate(114 0) scale(-1 1) translate(-114 0)" opacity="0"/><rect x="36" y="88" width="62" height="10" rx="5" fill="#8A5A44"/><rect x="36" y="82" width="62" height="10" rx="5" fill="url(#MapTamanSvg.mmw)" stroke="#6B4634" stroke-width="1.5"/><rect x="38" y="64" width="58" height="12" rx="6" fill="url(#MapTamanSvg.mmw)" stroke="#6B4634" stroke-width="1.5"/><rect x="42" y="94" width="8" height="26" rx="3" fill="#6B4634"/><rect x="84" y="94" width="8" height="26" rx="3" fill="#6B4634"/><rect x="42" y="72" width="6" height="14" rx="3" fill="#6B4634"/><rect x="86" y="72" width="6" height="14" rx="3" fill="#6B4634"/><rect x="122" y="76" width="10" height="50" rx="4" fill="#8A5A44"/><circle cx="127" cy="58" r="26" fill="#1B3A17"/><circle cx="127" cy="54" r="26" fill="url(#MapTamanSvg.mmg1)" stroke="#1B3A17" stroke-width="1.5"/><ellipse cx="118" cy="44" rx="8" ry="4" fill="#fff" opacity=".3" transform="rotate(-30 118 44)"/><circle cx="20" cy="122" r="7" fill="#F58AAE" stroke="#fff" stroke-width="1.5"/><circle cx="32" cy="114" r="7" fill="#FFCB45" stroke="#fff" stroke-width="1.5"/><circle cx="14" cy="110" r="7" fill="#A98BD6" stroke="#fff" stroke-width="1.5"/><circle cx="44" cy="124" r="7" fill="#F58A3A" stroke="#fff" stroke-width="1.5"/><path transform="translate(100 30) scale(0.9)" opacity="1" fill="#FFCB45" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/>`;

export const MapTamanSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 160"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "mapTaman"}
    dangerouslySetInnerHTML={{ __html: svgMapTamanSvg }}
  />
);

const svgMapMalamSvg = `<defs><linearGradient id="MapMalamSvg.mng" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34528F"/><stop offset="1" stop-color="#1B2F52"/></linearGradient></defs><clipPath id="MapMalamSvg.mnc"><rect x="8" y="8" width="144" height="144" rx="36"/></clipPath><rect x="8" y="18" width="144" height="144" rx="36" fill="#142544"/><g clip-path="url(#MapMalamSvg.mnc)"><rect x="8" y="8" width="144" height="144" fill="url(#MapMalamSvg.mng)"/><circle cx="48" cy="47" r="1.5" fill="#fff" opacity="1"/><circle cx="77" cy="49" r="2" fill="#fff" opacity="0.5"/><circle cx="131" cy="43" r="2" fill="#fff" opacity="0.5"/><circle cx="42" cy="56" r="2" fill="#fff" opacity="1"/><circle cx="77" cy="52" r="1" fill="#fff" opacity="0.5"/><circle cx="97" cy="63" r="2" fill="#fff" opacity="0.8"/><circle cx="110" cy="54" r="1" fill="#fff" opacity="0.5"/><circle cx="112" cy="50" r="1.5" fill="#fff" opacity="0.5"/><circle cx="120" cy="33" r="2" fill="#fff" opacity="1"/><circle cx="132" cy="39" r="1.5" fill="#fff" opacity="0.8"/><circle cx="108" cy="49" r="1" fill="#fff" opacity="0.8"/><circle cx="30" cy="27" r="1" fill="#fff" opacity="0.8"/><circle cx="138" cy="42" r="2" fill="#fff" opacity="0.8"/><circle cx="70" cy="62" r="2" fill="#fff" opacity="0.8"/><circle cx="84" cy="40" r="1" fill="#fff" opacity="0.8"/><circle cx="103" cy="66" r="1.5" fill="#fff" opacity="1"/><circle cx="112" cy="46" r="34" fill="#FFE27A" opacity=".2"/><path d="M118 22 A26 26 0 1 0 126 70 A21 21 0 1 1 118 22Z" fill="#FFE27A" stroke="#F5BE2B" stroke-width="1.5"/><g transform="translate(60 120) scale(0.8)" fill="#0D1A33"><rect x="-46" y="-18" width="92" height="18"/><path d="M-26 -18 C-26 -58 26 -58 26 -18Z"/><rect x="-1.6" y="-72" width="3.2" height="18"/><circle cx="0" cy="-74" r="4"/><rect x="-64" y="-56" width="11" height="56"/><polygon points="-67,-56 -58.5,-72 -50,-56"/><rect x="53" y="-56" width="11" height="56"/><polygon points="50,-56 58.5,-72 67,-56"/></g><g transform="translate(60 120) scale(0.8)" fill="#FFD84A"><path d="M-6 0 V-10 C-6 -16 6 -16 6 -10 V0Z"/><rect x="-60" y="-40" width="3" height="8" rx="1.5"/><rect x="57" y="-40" width="3" height="8" rx="1.5"/></g><g fill="#0D1A33"><rect x="108" y="94" width="30" height="30"/><polygon points="104,96 123,78 142,96"/></g><rect x="118" y="104" width="9" height="10" rx="2" fill="#FFD84A"/><rect x="0" y="116" width="160" height="40" fill="#0D1A33"/></g><rect x="8" y="8" width="144" height="144" rx="36" fill="none" stroke="#142544" stroke-width="1.5"/>`;

export const MapMalamSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 160 168"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "mapMalam"}
    dangerouslySetInnerHTML={{ __html: svgMapMalamSvg }}
  />
);

const svgObstacleSemakSvg = `<defs><linearGradient id="ObstacleSemakSvg.osg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8BCB7C"/><stop offset="1" stop-color="#3F7A38"/></linearGradient></defs><ellipse cx="64" cy="112" rx="48" ry="8" fill="#000" opacity=".14"/><circle cx="32" cy="82" r="24" fill="#1B3A17"/><circle cx="96" cy="82" r="24" fill="#1B3A17"/><circle cx="64" cy="64" r="32" fill="#1B3A17"/><circle cx="32" cy="78" r="24" fill="url(#ObstacleSemakSvg.osg)" stroke="#1B3A17" stroke-width="1.5"/><circle cx="96" cy="78" r="24" fill="url(#ObstacleSemakSvg.osg)" stroke="#1B3A17" stroke-width="1.5"/><circle cx="64" cy="60" r="32" fill="url(#ObstacleSemakSvg.osg)" stroke="#1B3A17" stroke-width="1.5"/><ellipse cx="50" cy="44" rx="12" ry="6" fill="#fff" opacity=".3" transform="rotate(-30 50 44)"/><circle cx="46" cy="70" r="5" fill="#F58AAE" stroke="#fff" stroke-width="1.5"/><circle cx="78" cy="58" r="5" fill="#FFCB45" stroke="#fff" stroke-width="1.5"/><circle cx="98" cy="84" r="5" fill="#F58AAE" stroke="#fff" stroke-width="1.5"/><circle cx="30" cy="86" r="5" fill="#FFCB45" stroke="#fff" stroke-width="1.5"/><circle cx="66" cy="86" r="5" fill="#fff" stroke="#fff" stroke-width="1.5"/>`;

export const ObstacleSemakSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 128"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "obstacleSemak"}
    dangerouslySetInnerHTML={{ __html: svgObstacleSemakSvg }}
  />
);

const svgStepNiatSvg = `<defs><linearGradient id="StepNiatSvg.stepNiatg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepNiatSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepNiatSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepNiatSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepNiatSvg.stepNiatc"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepNiatSvg.stepNiatc)"><rect x="8" y="8" width="184" height="184" fill="url(#StepNiatSvg.stepNiatg)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><path d="M38 210 C42 158 68 136 100 136 C132 136 158 158 162 210Z" fill="url(#StepNiatSvg.shr)" stroke="#2A7A68" stroke-width="1.5"/><path d="M86 136 L100 156 L114 136Z" fill="#fff" stroke="#2A7A68" stroke-width="1.2"/><rect x="88" y="120" width="24" height="22" rx="8" fill="#F2B88A"/><circle cx="62" cy="104" r="8" fill="#F2B88A"/><circle cx="138" cy="104" r="8" fill="#F2B88A"/><circle cx="100" cy="100" r="38" fill="url(#StepNiatSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M62 86 C62 48 138 48 138 86 C124 76 76 76 62 86Z" fill="#fff" stroke="#C9B79A" stroke-width="1.5"/><rect x="62" y="80" width="76" height="10" rx="5" fill="#F3E6D3" stroke="#C9B79A" stroke-width="1.2"/><path d="M78 104 Q86 112 94 104 M106 104 Q114 112 122 104" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><circle cx="74" cy="118" r="6" fill="#F58A8A" opacity=".5"/><circle cx="126" cy="118" r="6" fill="#F58A8A" opacity=".5"/><path d="M91 120 Q100 130 109 120" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(100 168) rotate(-90) scale(0.8)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepNiatSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><circle cx="158" cy="46" r="26" fill="#fff" stroke="#8CC7E3" stroke-width="1.5"/><circle cx="132" cy="70" r="6" fill="#fff" stroke="#8CC7E3" stroke-width="1.2"/><circle cx="122" cy="82" r="3.5" fill="#fff"/><path d="M64 112 C16 78 10 42 36 28 C52 20 62 30 64 40 C66 30 76 20 92 28 C118 42 112 78 64 112Z" fill="#F58AAE" stroke="#D14E7C" stroke-width="8" transform="translate(144 32) scale(.22)"/><path transform="translate(40 50) scale(1.2)" opacity="1" fill="#FFCB45" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepNiatSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepNiat"}
    dangerouslySetInnerHTML={{ __html: svgStepNiatSvg }}
  />
);

const svgStepCuciTanganSvg = `<defs><linearGradient id="StepCuciTanganSvg.stepCuciTangang" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepCuciTanganSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepCuciTanganSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepCuciTanganSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepCuciTanganSvg.stepCuciTanganc"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepCuciTanganSvg.stepCuciTanganc)"><rect x="8" y="8" width="184" height="184" fill="url(#StepCuciTanganSvg.stepCuciTangang)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><rect x="68" y="20" width="52" height="16" rx="8" fill="#8E9AAD" stroke="#6F7C92" stroke-width="1.5"/><rect x="90" y="30" width="16" height="22" rx="6" fill="#C9D1DE" stroke="#6F7C92" stroke-width="1.5"/><rect x="80" y="12" width="10" height="12" rx="4" fill="#E5483E"/><path d="M93.0 52 V118 h14 V52Z" fill="url(#StepCuciTanganSvg.wtr)" opacity=".9"/><path d="M96.5 56 V112" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/><g transform="translate(72 134) rotate(-12) scale(1.25)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepCuciTanganSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><g transform="translate(130 134) rotate(12) scale(1.25)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepCuciTanganSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><g transform="translate(44 100) scale(1.1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepCuciTanganSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(158 96) scale(1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepCuciTanganSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(52 74) scale(0.8)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepCuciTanganSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(150 70) scale(0.8)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepCuciTanganSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><ellipse cx="100" cy="176" rx="56" ry="9" fill="#9FE0FA" opacity=".7"/><path transform="translate(170 150) scale(1)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(30 150) scale(0.9)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepCuciTanganSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepCuciTangan"}
    dangerouslySetInnerHTML={{ __html: svgStepCuciTanganSvg }}
  />
);

const svgStepBerkumurSvg = `<defs><linearGradient id="StepBerkumurSvg.stepBerkumurg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepBerkumurSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepBerkumurSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepBerkumurSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepBerkumurSvg.stepBerkumurc"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepBerkumurSvg.stepBerkumurc)"><rect x="8" y="8" width="184" height="184" fill="url(#StepBerkumurSvg.stepBerkumurg)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><path d="M34 210 C38 158 64 136 96 136 C128 136 154 158 158 210Z" fill="url(#StepBerkumurSvg.shr)" stroke="#2A7A68" stroke-width="1.5"/><path d="M82 136 L96 156 L110 136Z" fill="#fff" stroke="#2A7A68" stroke-width="1.2"/><rect x="84" y="120" width="24" height="22" rx="8" fill="#F2B88A"/><circle cx="62" cy="112" r="15" fill="url(#StepBerkumurSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><circle cx="130" cy="112" r="15" fill="url(#StepBerkumurSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><circle cx="58" cy="100" r="8" fill="#F2B88A"/><circle cx="134" cy="100" r="8" fill="#F2B88A"/><circle cx="96" cy="96" r="38" fill="url(#StepBerkumurSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M58 82 C58 44 134 44 134 82 C120 72 72 72 58 82Z" fill="#fff" stroke="#C9B79A" stroke-width="1.5"/><rect x="58" y="76" width="76" height="10" rx="5" fill="#F3E6D3" stroke="#C9B79A" stroke-width="1.2"/><path d="M74 100 Q82 108 90 100 M102 100 Q110 108 118 100" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><circle cx="70" cy="114" r="6" fill="#F58A8A" opacity=".5"/><circle cx="122" cy="114" r="6" fill="#F58A8A" opacity=".5"/><ellipse cx="96" cy="120" rx="5" ry="6" fill="#8A3F0A"/><circle cx="132" cy="122" r="7" fill="#DDF3FC" stroke="#4FB6E6" stroke-width="1.5"/><circle cx="142" cy="108" r="5" fill="#DDF3FC" stroke="#4FB6E6" stroke-width="1.2"/><circle cx="148" cy="124" r="4" fill="#DDF3FC" stroke="#4FB6E6" stroke-width="1.2"/><path d="M146 150 H182 L178 186 H150Z" fill="#6CC3E6" stroke="#2F93C4" stroke-width="1.5" stroke-linejoin="round"/><path d="M148 160 H180" stroke="#fff" stroke-width="3" opacity=".6"/><g transform="translate(160 188) rotate(0) scale(0.7)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepBerkumurSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><g transform="translate(26 70) scale(1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBerkumurSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(172 60) scale(0.9)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBerkumurSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><path transform="translate(30 150) scale(1)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepBerkumurSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepBerkumur"}
    dangerouslySetInnerHTML={{ __html: svgStepBerkumurSvg }}
  />
);

const svgStepHirupAirSvg = `<defs><linearGradient id="StepHirupAirSvg.stepHirupAirg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepHirupAirSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepHirupAirSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepHirupAirSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepHirupAirSvg.stepHirupAirc"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepHirupAirSvg.stepHirupAirc)"><rect x="8" y="8" width="184" height="184" fill="url(#StepHirupAirSvg.stepHirupAirg)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><path d="M38 210 C42 158 68 136 100 136 C132 136 158 158 162 210Z" fill="url(#StepHirupAirSvg.shr)" stroke="#2A7A68" stroke-width="1.5"/><path d="M86 136 L100 156 L114 136Z" fill="#fff" stroke="#2A7A68" stroke-width="1.2"/><rect x="88" y="120" width="24" height="22" rx="8" fill="#F2B88A"/><circle cx="62" cy="94" r="8" fill="#F2B88A"/><circle cx="138" cy="94" r="8" fill="#F2B88A"/><circle cx="100" cy="90" r="38" fill="url(#StepHirupAirSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M62 76 C62 38 138 38 138 76 C124 66 76 66 62 76Z" fill="#fff" stroke="#C9B79A" stroke-width="1.5"/><rect x="62" y="70" width="76" height="10" rx="5" fill="#F3E6D3" stroke="#C9B79A" stroke-width="1.2"/><path d="M78 94 Q86 102 94 94 M106 94 Q114 102 122 94" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><circle cx="74" cy="108" r="6" fill="#F58A8A" opacity=".5"/><circle cx="126" cy="108" r="6" fill="#F58A8A" opacity=".5"/><path d="M91 110 Q100 120 109 110" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(110 142) rotate(0) scale(1.0)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepHirupAirSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><ellipse cx="110" cy="136" rx="17" ry="6" fill="url(#StepHirupAirSvg.wtr)" stroke="#2F93C4" stroke-width="1.2"/><path d="M104 128 C100 118 100 112 102 108" stroke="#4FB6E6" stroke-width="3" fill="none" stroke-linecap="round" stroke-dasharray="2 6"/><g transform="translate(96 112) scale(0.7)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepHirupAirSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(36 70) scale(1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepHirupAirSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><path transform="translate(168 60) scale(1.2)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepHirupAirSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepHirupAir"}
    dangerouslySetInnerHTML={{ __html: svgStepHirupAirSvg }}
  />
);

const svgStepBasuhWajahSvg = `<defs><linearGradient id="StepBasuhWajahSvg.stepBasuhWajahg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepBasuhWajahSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepBasuhWajahSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepBasuhWajahSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepBasuhWajahSvg.stepBasuhWajahc"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepBasuhWajahSvg.stepBasuhWajahc)"><rect x="8" y="8" width="184" height="184" fill="url(#StepBasuhWajahSvg.stepBasuhWajahg)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><path d="M38 210 C42 158 68 136 100 136 C132 136 158 158 162 210Z" fill="url(#StepBasuhWajahSvg.shr)" stroke="#2A7A68" stroke-width="1.5"/><path d="M86 136 L100 156 L114 136Z" fill="#fff" stroke="#2A7A68" stroke-width="1.2"/><rect x="88" y="120" width="24" height="22" rx="8" fill="#F2B88A"/><circle cx="62" cy="100" r="8" fill="#F2B88A"/><circle cx="138" cy="100" r="8" fill="#F2B88A"/><circle cx="100" cy="96" r="38" fill="url(#StepBasuhWajahSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M62 82 C62 44 138 44 138 82 C124 72 76 72 62 82Z" fill="#fff" stroke="#C9B79A" stroke-width="1.5"/><rect x="62" y="76" width="76" height="10" rx="5" fill="#F3E6D3" stroke="#C9B79A" stroke-width="1.2"/><path d="M78 104 Q86 94 94 104 M106 104 Q114 94 122 104" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><circle cx="74" cy="114" r="6" fill="#F58A8A" opacity=".5"/><circle cx="126" cy="114" r="6" fill="#F58A8A" opacity=".5"/><path d="M91 116 Q100 126 109 116" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(52 120) rotate(70) scale(0.9)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepBasuhWajahSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><g transform="translate(148 120) rotate(-70) scale(0.9)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepBasuhWajahSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><path d="M80 100 q-2 14 0 24 M120 100 q2 14 0 24" stroke="#9FE0FA" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/><g transform="translate(36 56) scale(1.1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhWajahSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(164 62) scale(1.1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhWajahSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(26 150) scale(0.9)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhWajahSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(176 146) scale(0.9)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhWajahSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><path transform="translate(150 40) scale(1.4)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(50 36) scale(1.1)" opacity="1" fill="#FFCB45" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepBasuhWajahSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepBasuhWajah"}
    dangerouslySetInnerHTML={{ __html: svgStepBasuhWajahSvg }}
  />
);

const svgStepBasuhTanganSvg = `<defs><linearGradient id="StepBasuhTanganSvg.stepBasuhTangang" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepBasuhTanganSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepBasuhTanganSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepBasuhTanganSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepBasuhTanganSvg.stepBasuhTanganc"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepBasuhTanganSvg.stepBasuhTanganc)"><rect x="8" y="8" width="184" height="184" fill="url(#StepBasuhTanganSvg.stepBasuhTangang)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><path d="M30 52 L96 118" stroke="#2A7A68" stroke-width="46" stroke-linecap="round"/><path d="M30 52 L96 118" stroke="url(#StepBasuhTanganSvg.shr)" stroke-width="42" stroke-linecap="round"/><path d="M70 82 L124 136" stroke="#D9955E" stroke-width="36" stroke-linecap="round"/><path d="M70 82 L124 136" stroke="url(#StepBasuhTanganSvg.skn)" stroke-width="32" stroke-linecap="round"/><g transform="translate(138 150) rotate(-40) scale(1.0)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepBasuhTanganSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><rect x="102" y="22" width="52" height="16" rx="8" fill="#8E9AAD" stroke="#6F7C92" stroke-width="1.5"/><rect x="124" y="32" width="16" height="22" rx="6" fill="#C9D1DE" stroke="#6F7C92" stroke-width="1.5"/><rect x="114" y="14" width="10" height="12" rx="4" fill="#E5483E"/><path d="M128.0 54 V130 h12 V54Z" fill="url(#StepBasuhTanganSvg.wtr)" opacity=".9"/><path d="M131.0 58 V124" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/><path d="M82 92 q16 -6 20 12 M92 82 q16 -4 22 12" stroke="#4FB6E6" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="62" cy="76" r="20" fill="none" stroke="#FFCB45" stroke-width="3" stroke-dasharray="4 5"/><g transform="translate(168 132) scale(1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhTanganSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(110 168) scale(0.9)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhTanganSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(70 140) scale(0.8)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhTanganSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><path transform="translate(30 150) scale(1.1)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepBasuhTanganSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepBasuhTangan"}
    dangerouslySetInnerHTML={{ __html: svgStepBasuhTanganSvg }}
  />
);

const svgStepUsapKepalaSvg = `<defs><linearGradient id="StepUsapKepalaSvg.stepUsapKepalag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepUsapKepalaSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepUsapKepalaSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepUsapKepalaSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepUsapKepalaSvg.stepUsapKepalac"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepUsapKepalaSvg.stepUsapKepalac)"><rect x="8" y="8" width="184" height="184" fill="url(#StepUsapKepalaSvg.stepUsapKepalag)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><path d="M34 210 C38 158 64 136 96 136 C128 136 154 158 158 210Z" fill="url(#StepUsapKepalaSvg.shr)" stroke="#2A7A68" stroke-width="1.5"/><path d="M82 136 L96 156 L110 136Z" fill="#fff" stroke="#2A7A68" stroke-width="1.2"/><rect x="84" y="120" width="24" height="22" rx="8" fill="#F2B88A"/><circle cx="58" cy="108" r="8" fill="#F2B88A"/><circle cx="134" cy="108" r="8" fill="#F2B88A"/><circle cx="96" cy="104" r="38" fill="url(#StepUsapKepalaSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M58 98 C54 56 138 56 134 98 C122 76 70 76 58 98Z" fill="#3E2518"/><path d="M74 108 Q82 116 90 108 M102 108 Q110 116 118 108" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><circle cx="70" cy="122" r="6" fill="#F58A8A" opacity=".5"/><circle cx="122" cy="122" r="6" fill="#F58A8A" opacity=".5"/><path d="M87 124 Q96 134 105 124" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(96 52) rotate(0) scale(1.1)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepUsapKepalaSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><path d="M120 54 L168 110" stroke="#2A7A68" stroke-width="30" stroke-linecap="round"/><path d="M120 54 L168 110" stroke="url(#StepUsapKepalaSvg.shr)" stroke-width="26" stroke-linecap="round"/><g transform="translate(70 32) scale(0.8)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepUsapKepalaSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(122 30) scale(0.9)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepUsapKepalaSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(150 30) scale(0.7)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepUsapKepalaSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(40 90) scale(1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepUsapKepalaSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><path transform="translate(36 150) scale(1.2)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(170 40) scale(1)" opacity="1" fill="#FFCB45" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepUsapKepalaSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepUsapKepala"}
    dangerouslySetInnerHTML={{ __html: svgStepUsapKepalaSvg }}
  />
);

const svgStepBasuhKakiSvg = `<defs><linearGradient id="StepBasuhKakiSvg.stepBasuhKakig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepBasuhKakiSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepBasuhKakiSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepBasuhKakiSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepBasuhKakiSvg.stepBasuhKakic"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepBasuhKakiSvg.stepBasuhKakic)"><rect x="8" y="8" width="184" height="184" fill="url(#StepBasuhKakiSvg.stepBasuhKakig)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><rect x="68" y="14" width="52" height="16" rx="8" fill="#8E9AAD" stroke="#6F7C92" stroke-width="1.5"/><rect x="90" y="24" width="16" height="22" rx="6" fill="#C9D1DE" stroke="#6F7C92" stroke-width="1.5"/><rect x="80" y="6" width="10" height="12" rx="4" fill="#E5483E"/><path d="M92.0 46 V120 h16 V46Z" fill="url(#StepBasuhKakiSvg.wtr)" opacity=".9"/><path d="M96.0 50 V114" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".7"/><g transform="translate(72 134) rotate(-6)"><path d="M-20 18 C-26 -14 -16 -38 0 -40 C16 -38 26 -14 20 18 C18 40 -18 40 -20 18Z" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><circle cx="18" cy="-40" r="6.5" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><circle cx="10" cy="-46" r="6" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><circle cx="1" cy="-48" r="6" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><circle cx="-7" cy="-46" r="5.5" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><circle cx="-14" cy="-40" r="5" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><ellipse cx="-6" cy="-10" rx="5" ry="10" fill="#fff" opacity=".3"/></g><g transform="translate(130 134) rotate(6)"><path d="M-20 18 C-26 -14 -16 -38 0 -40 C16 -38 26 -14 20 18 C18 40 -18 40 -20 18Z" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><circle cx="18" cy="-40" r="6.5" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><circle cx="10" cy="-46" r="6" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><circle cx="1" cy="-48" r="6" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><circle cx="-7" cy="-46" r="5.5" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><circle cx="-14" cy="-40" r="5" fill="url(#StepBasuhKakiSvg.skn)" stroke="#D9955E" stroke-width="1.2"/><ellipse cx="-6" cy="-10" rx="5" ry="10" fill="#fff" opacity=".3"/></g><ellipse cx="100" cy="182" rx="66" ry="11" fill="#9FE0FA" opacity=".85"/><ellipse cx="100" cy="180" rx="50" ry="6" fill="#fff" opacity=".4"/><g transform="translate(36 110) scale(1.1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhKakiSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(168 106) scale(1.1)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhKakiSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(46 160) scale(0.8)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhKakiSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><g transform="translate(158 158) scale(0.8)"><path d="M0 -10 C8 0 9 8 0 10 C-9 8 -8 0 0 -10Z" fill="url(#StepBasuhKakiSvg.wtr)" stroke="#2F93C4" stroke-width="1.5"/><ellipse cx="-2.5" cy="2" rx="1.8" ry="3" fill="#fff" opacity=".7"/></g><path transform="translate(30 50) scale(1.1)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(172 60) scale(1)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepBasuhKakiSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepBasuhKaki"}
    dangerouslySetInnerHTML={{ __html: svgStepBasuhKakiSvg }}
  />
);

const svgStepDoaSelesaiSvg = `<defs><linearGradient id="StepDoaSelesaiSvg.stepDoaSelesaig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F6FD"/><stop offset="1" stop-color="#BFE3F2"/></linearGradient><linearGradient id="StepDoaSelesaiSvg.skn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAD3AE"/><stop offset="1" stop-color="#F2B88A"/></linearGradient><linearGradient id="StepDoaSelesaiSvg.shr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FDCC8"/><stop offset="1" stop-color="#3FA892"/></linearGradient><linearGradient id="StepDoaSelesaiSvg.wtr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FE0FA"/><stop offset="1" stop-color="#4FB6E6"/></linearGradient></defs><clipPath id="StepDoaSelesaiSvg.stepDoaSelesaic"><rect x="8" y="8" width="184" height="184" rx="44"/></clipPath><rect x="8" y="16" width="184" height="184" rx="44" fill="#5FA6CC"/><g clip-path="url(#StepDoaSelesaiSvg.stepDoaSelesaic)"><rect x="8" y="8" width="184" height="184" fill="url(#StepDoaSelesaiSvg.stepDoaSelesaig)"/><circle cx="160" cy="30" r="46" fill="#fff" opacity=".35"/><circle cx="30" cy="176" r="40" fill="#fff" opacity=".25"/><path d="M38 210 C42 158 68 136 100 136 C132 136 158 158 162 210Z" fill="url(#StepDoaSelesaiSvg.shr)" stroke="#2A7A68" stroke-width="1.5"/><path d="M86 136 L100 156 L114 136Z" fill="#fff" stroke="#2A7A68" stroke-width="1.2"/><rect x="88" y="120" width="24" height="22" rx="8" fill="#F2B88A"/><circle cx="62" cy="100" r="8" fill="#F2B88A"/><circle cx="138" cy="100" r="8" fill="#F2B88A"/><circle cx="100" cy="96" r="38" fill="url(#StepDoaSelesaiSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M62 82 C62 44 138 44 138 82 C124 72 76 72 62 82Z" fill="#fff" stroke="#C9B79A" stroke-width="1.5"/><rect x="62" y="76" width="76" height="10" rx="5" fill="#F3E6D3" stroke="#C9B79A" stroke-width="1.2"/><path d="M78 104 Q86 94 94 104 M106 104 Q114 94 122 104" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><circle cx="74" cy="114" r="6" fill="#F58A8A" opacity=".5"/><circle cx="126" cy="114" r="6" fill="#F58A8A" opacity=".5"/><path d="M91 116 Q100 126 109 116" fill="none" stroke="#3E2518" stroke-width="3.5" stroke-linecap="round"/><g transform="translate(74 168) rotate(-20) scale(0.9)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepDoaSelesaiSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><g transform="translate(126 168) rotate(20) scale(0.9)"><ellipse cx="0" cy="0" rx="22" ry="15" fill="url(#StepDoaSelesaiSvg.skn)" stroke="#D9955E" stroke-width="1.5"/><path d="M-14 -12 q-2 -10 2 -12 M-4 -14 q-1 -12 4 -13 M6 -14 q1 -11 5 -10 M15 -10 q3 -8 6 -6" fill="none" stroke="#D9955E" stroke-width="1.5" stroke-linecap="round"/><rect x="-15" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="-6" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="3" y="-29" width="6" height="16" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/><rect x="12" y="-26" width="6" height="14" rx="3" fill="#FAD3AE" stroke="#D9955E" stroke-width="1.2"/></g><path d="M150 30 A18 18 0 1 0 156 66 A14 14 0 1 1 150 30Z" fill="#FFE27A" stroke="#F5BE2B" stroke-width="1.5"/><path transform="translate(40 44) scale(1.5)" opacity="1" fill="#FFCB45" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(172 96) scale(1)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(30 110) scale(0.9)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path d="M64 112 C16 78 10 42 36 28 C52 20 62 30 64 40 C66 30 76 20 92 28 C118 42 112 78 64 112Z" fill="#F58AAE" stroke="#D14E7C" stroke-width="8" transform="translate(22 128) scale(.16)"/></g><rect x="8" y="8" width="184" height="184" rx="44" fill="none" stroke="#5FA6CC" stroke-width="1.5"/>`;

export const StepDoaSelesaiSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 200 208"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "stepDoaSelesai"}
    dangerouslySetInnerHTML={{ __html: svgStepDoaSelesaiSvg }}
  />
);

const svgIconSholatSubuhSvg = `<defs><linearGradient id="IconSholatSubuhSvg.iconSholatSubuhg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A98BD6"/><stop offset="1" stop-color="#FFC49A"/></linearGradient></defs><clipPath id="IconSholatSubuhSvg.iconSholatSubuhc"><rect x="6" y="6" width="116" height="116" rx="32"/></clipPath><rect x="6" y="14" width="116" height="116" rx="32" fill="#5B4A8A"/><g clip-path="url(#IconSholatSubuhSvg.iconSholatSubuhc)"><rect x="6" y="6" width="116" height="116" fill="url(#IconSholatSubuhSvg.iconSholatSubuhg)"/><path transform="translate(30 30) scale(0.8)" opacity="0.8" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(98 24) scale(0.6)" opacity="0.7" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(84 46) scale(0.5)" opacity="0.6" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><circle cx="64" cy="94" r="42" fill="#FFE9B8" opacity=".5"/><circle cx="64" cy="94" r="26" fill="url(#IconSholatSubuhSvg.sunG)" stroke="#F29A12" stroke-width="1.5"/><g transform="translate(64 112) scale(0.66)" fill="#4B3A7A"><rect x="-46" y="-18" width="92" height="18"/><path d="M-26 -18 C-26 -58 26 -58 26 -18Z"/><rect x="-1.6" y="-72" width="3.2" height="18"/><circle cx="0" cy="-74" r="4"/><rect x="-64" y="-56" width="11" height="56"/><polygon points="-67,-56 -58.5,-72 -50,-56"/><rect x="53" y="-56" width="11" height="56"/><polygon points="50,-56 58.5,-72 67,-56"/></g><rect x="0" y="108" width="128" height="20" fill="#3A2D63"/><linearGradient id="IconSholatSubuhSvg.sunG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFC53D"/></linearGradient><ellipse cx="38" cy="16" rx="30" ry="8" fill="#fff" opacity=".22"/></g><rect x="6" y="6" width="116" height="116" rx="32" fill="none" stroke="#5B4A8A" stroke-width="1.5"/>`;

export const IconSholatSubuhSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 136"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconSholatSubuh"}
    dangerouslySetInnerHTML={{ __html: svgIconSholatSubuhSvg }}
  />
);

const svgIconSholatDzuhurSvg = `<defs><linearGradient id="IconSholatDzuhurSvg.iconSholatDzuhurg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD3F5"/><stop offset="1" stop-color="#D5F1FF"/></linearGradient></defs><clipPath id="IconSholatDzuhurSvg.iconSholatDzuhurc"><rect x="6" y="6" width="116" height="116" rx="32"/></clipPath><rect x="6" y="14" width="116" height="116" rx="32" fill="#2F93C4"/><g clip-path="url(#IconSholatDzuhurSvg.iconSholatDzuhurc)"><rect x="6" y="6" width="116" height="116" fill="url(#IconSholatDzuhurSvg.iconSholatDzuhurg)"/><circle cx="64" cy="56" r="40" fill="#FFF3B0" opacity=".5"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(0 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(30 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(60 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(90 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(120 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(150 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(180 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(210 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(240 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(270 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(300 64 56)"/><path d="M64 14 V24" stroke="#FFCB45" stroke-width="5" stroke-linecap="round" transform="rotate(330 64 56)"/><circle cx="64" cy="56" r="22" fill="url(#IconSholatDzuhurSvg.sunG)" stroke="#F29A12" stroke-width="1.5"/><g transform="translate(2 78) scale(0.9)" fill="#fff" opacity="1"><circle cx="20" cy="26" r="14"/><circle cx="40" cy="18" r="18"/><circle cx="60" cy="27" r="13"/><rect x="8" y="26" width="64" height="14" rx="7"/></g><g transform="translate(66 88) scale(0.8)" fill="#F4FAFF" opacity="1"><circle cx="20" cy="26" r="14"/><circle cx="40" cy="18" r="18"/><circle cx="60" cy="27" r="13"/><rect x="8" y="26" width="64" height="14" rx="7"/></g><g transform="translate(34 98) scale(0.7)" fill="#fff" opacity="0.9"><circle cx="20" cy="26" r="14"/><circle cx="40" cy="18" r="18"/><circle cx="60" cy="27" r="13"/><rect x="8" y="26" width="64" height="14" rx="7"/></g><linearGradient id="IconSholatDzuhurSvg.sunG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFC53D"/></linearGradient><ellipse cx="38" cy="16" rx="30" ry="8" fill="#fff" opacity=".22"/></g><rect x="6" y="6" width="116" height="116" rx="32" fill="none" stroke="#2F93C4" stroke-width="1.5"/>`;

export const IconSholatDzuhurSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 136"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconSholatDzuhur"}
    dangerouslySetInnerHTML={{ __html: svgIconSholatDzuhurSvg }}
  />
);

const svgIconSholatAsharSvg = `<defs><linearGradient id="IconSholatAsharSvg.iconSholatAsharg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE9B0"/><stop offset="1" stop-color="#FFB347"/></linearGradient></defs><clipPath id="IconSholatAsharSvg.iconSholatAsharc"><rect x="6" y="6" width="116" height="116" rx="32"/></clipPath><rect x="6" y="14" width="116" height="116" rx="32" fill="#B8590C"/><g clip-path="url(#IconSholatAsharSvg.iconSholatAsharc)"><rect x="6" y="6" width="116" height="116" fill="url(#IconSholatAsharSvg.iconSholatAsharg)"/><circle cx="88" cy="48" r="38" fill="#FFF3B0" opacity=".55"/><circle cx="88" cy="48" r="20" fill="url(#IconSholatAsharSvg.sunG)" stroke="#F29A12" stroke-width="1.5"/><g transform="translate(8 40) scale(0.8)" fill="#FFF8EE" opacity="0.9"><circle cx="20" cy="26" r="14"/><circle cx="40" cy="18" r="18"/><circle cx="60" cy="27" r="13"/><rect x="8" y="26" width="64" height="14" rx="7"/></g><path d="M0 98 C30 76 60 90 90 82 C110 78 124 86 128 88 V128 H0Z" fill="#F5A623"/><path d="M0 108 C34 94 70 108 128 98 V128 H0Z" fill="#E2561A" opacity=".85"/><path d="M26 64 q4 -5 8 0 q4 -5 8 0 M46 78 q3 -4 6 0 q3 -4 6 0" fill="none" stroke="#8A3F0A" stroke-width="2" stroke-linecap="round"/><linearGradient id="IconSholatAsharSvg.sunG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFC53D"/></linearGradient><ellipse cx="38" cy="16" rx="30" ry="8" fill="#fff" opacity=".22"/></g><rect x="6" y="6" width="116" height="116" rx="32" fill="none" stroke="#B8590C" stroke-width="1.5"/>`;

export const IconSholatAsharSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 136"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconSholatAshar"}
    dangerouslySetInnerHTML={{ __html: svgIconSholatAsharSvg }}
  />
);

const svgIconSholatMaghribSvg = `<defs><linearGradient id="IconSholatMaghribSvg.iconSholatMaghribg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9544A"/><stop offset="1" stop-color="#FFB347"/></linearGradient></defs><clipPath id="IconSholatMaghribSvg.iconSholatMaghribc"><rect x="6" y="6" width="116" height="116" rx="32"/></clipPath><rect x="6" y="14" width="116" height="116" rx="32" fill="#7A1F2B"/><g clip-path="url(#IconSholatMaghribSvg.iconSholatMaghribc)"><rect x="6" y="6" width="116" height="116" fill="url(#IconSholatMaghribSvg.iconSholatMaghribg)"/><circle cx="64" cy="92" r="46" fill="#FFD9A0" opacity=".45"/><circle cx="64" cy="96" r="25" fill="url(#IconSholatMaghribSvg.sunG)"/><g transform="translate(6 36) scale(0.8)" fill="#FFC9A6" opacity="0.6"><circle cx="20" cy="26" r="14"/><circle cx="40" cy="18" r="18"/><circle cx="60" cy="27" r="13"/><rect x="8" y="26" width="64" height="14" rx="7"/></g><g transform="translate(70 52) scale(0.7)" fill="#FFC9A6" opacity="0.55"><circle cx="20" cy="26" r="14"/><circle cx="40" cy="18" r="18"/><circle cx="60" cy="27" r="13"/><rect x="8" y="26" width="64" height="14" rx="7"/></g><path d="M24 50 q4 -5 8 0 q4 -5 8 0" fill="none" stroke="#5A1F2B" stroke-width="2" stroke-linecap="round"/><g transform="translate(64 114) scale(0.66)" fill="#5A1F2B"><rect x="-46" y="-18" width="92" height="18"/><path d="M-26 -18 C-26 -58 26 -58 26 -18Z"/><rect x="-1.6" y="-72" width="3.2" height="18"/><circle cx="0" cy="-74" r="4"/><rect x="-64" y="-56" width="11" height="56"/><polygon points="-67,-56 -58.5,-72 -50,-56"/><rect x="53" y="-56" width="11" height="56"/><polygon points="50,-56 58.5,-72 67,-56"/></g><rect x="0" y="108" width="128" height="20" fill="#3E1420"/><linearGradient id="IconSholatMaghribSvg.sunG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFC53D"/></linearGradient><ellipse cx="38" cy="16" rx="30" ry="8" fill="#fff" opacity=".22"/></g><rect x="6" y="6" width="116" height="116" rx="32" fill="none" stroke="#7A1F2B" stroke-width="1.5"/>`;

export const IconSholatMaghribSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 136"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconSholatMaghrib"}
    dangerouslySetInnerHTML={{ __html: svgIconSholatMaghribSvg }}
  />
);

const svgIconSholatIsyaSvg = `<defs><linearGradient id="IconSholatIsyaSvg.iconSholatIsyag" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34528F"/><stop offset="1" stop-color="#1B2F52"/></linearGradient></defs><clipPath id="IconSholatIsyaSvg.iconSholatIsyac"><rect x="6" y="6" width="116" height="116" rx="32"/></clipPath><rect x="6" y="14" width="116" height="116" rx="32" fill="#142544"/><g clip-path="url(#IconSholatIsyaSvg.iconSholatIsyac)"><rect x="6" y="6" width="116" height="116" fill="url(#IconSholatIsyaSvg.iconSholatIsyag)"/><circle cx="84" cy="44" r="34" fill="#FFE27A" opacity=".22"/><path d="M92 20 A26 26 0 1 0 100 68 A21 21 0 1 1 92 20Z" fill="#FFE27A" stroke="#F5BE2B" stroke-width="1.5"/><path transform="translate(30 30) scale(1)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(54 60) scale(0.6)" opacity="0.8" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(106 84) scale(0.7)" opacity="1" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><path transform="translate(20 66) scale(0.5)" opacity="0.8" fill="#fff" d="M0 -10 C1 -3 3 -1 10 0 C3 1 1 3 0 10 C-1 3 -3 1 -10 0 C-3 -1 -1 -3 0 -10Z"/><g transform="translate(64 114) scale(0.66)" fill="#142544"><rect x="-46" y="-18" width="92" height="18"/><path d="M-26 -18 C-26 -58 26 -58 26 -18Z"/><rect x="-1.6" y="-72" width="3.2" height="18"/><circle cx="0" cy="-74" r="4"/><rect x="-64" y="-56" width="11" height="56"/><polygon points="-67,-56 -58.5,-72 -50,-56"/><rect x="53" y="-56" width="11" height="56"/><polygon points="50,-56 58.5,-72 67,-56"/></g><g transform="translate(64 114) scale(0.66)" fill="#FFD84A"><path d="M-6 0 V-10 C-6 -16 6 -16 6 -10 V0Z"/><rect x="-60" y="-40" width="3" height="8" rx="1.5"/><rect x="57" y="-40" width="3" height="8" rx="1.5"/></g><rect x="0" y="108" width="128" height="20" fill="#0D1A33"/><linearGradient id="IconSholatIsyaSvg.sunG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF3B0"/><stop offset="1" stop-color="#FFC53D"/></linearGradient><ellipse cx="38" cy="16" rx="30" ry="8" fill="#fff" opacity=".22"/></g><rect x="6" y="6" width="116" height="116" rx="32" fill="none" stroke="#142544" stroke-width="1.5"/>`;

export const IconSholatIsyaSvg: React.FC<AsetSvgProps> = ({
  size,
  className,
  style,
  ariaLabel,
}) => (
  <svg
    viewBox="0 0 128 136"
    width={size}
    height={size}
    className={className}
    style={style}
    role="img"
    aria-label={ariaLabel ?? "iconSholatIsya"}
    dangerouslySetInnerHTML={{ __html: svgIconSholatIsyaSvg }}
  />
);
