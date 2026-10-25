import { readFileSync, writeFileSync, existsSync } from "node:fs";

const srcRoot = "../sambung-ngaji/frontend/src/assets/ngaji-ceria-new";

const ASSETS = {
  BintangSvg: [srcRoot, "ngaji-ceria-tilawati/svg/01-hud/bintangPenuh.svg"],
  BintangKosongSvg: [srcRoot, "ngaji-ceria-tilawati/svg/01-hud/bintangKosong.svg"],
  HatiNyawaSvg: [srcRoot, "ngaji-ceria-tilawati/svg/01-hud/hatiNyawa.svg"],
  MahkotaVipSvg: [srcRoot, "ngaji-ceria-tilawati/svg/01-hud/mahkotaVip.svg"],
  ApiStreakSvg: [srcRoot, "ngaji-ceria-tilawati/svg/01-hud/apiStreak.svg"],
  ApiStreakMatiSvg: [srcRoot, "ngaji-ceria-tilawati/svg/01-hud/apiStreakMati.svg"],
  BukuJuzAmmaSvg: [srcRoot, "ngaji-ceria-tilawati/svg/09-buku/bukuJuzAmma.svg"],
  BukuTilawatiJilid1Svg: [srcRoot, "ngaji-ceria-tilawati/svg/09-buku/bukuTilawatiJilid1.svg"],
  BukuTilawatiJilid2Svg: [srcRoot, "ngaji-ceria-tilawati/svg/09-buku/bukuTilawatiJilid2.svg"],
  BukuTilawatiJilid3Svg: [srcRoot, "ngaji-ceria-tilawati/svg/09-buku/bukuTilawatiJilid3.svg"],
  BukuTilawatiJilid4Svg: [srcRoot, "ngaji-ceria-tilawati/svg/09-buku/bukuTilawatiJilid4.svg"],
  BukuTilawatiJilid5Svg: [srcRoot, "ngaji-ceria-tilawati/svg/09-buku/bukuTilawatiJilid5.svg"],
  KartuMatchCocokSvg: [srcRoot, "ngaji-ceria-tilawati/svg/04-kartu/kartuMatchCocok.svg"],
  TebakSurahBaruSvg: [srcRoot, "ngaji-ceria-tilawati/svg/07-game/tebakSurahBaru.svg"],
  OrnamenPeciSvg: [srcRoot, "ngaji-ceria-tilawati/svg/12-ornamen/ornamenPeci.svg"],
  OrnamenKilauSvg: [srcRoot, "ngaji-ceria-tilawati/svg/12-ornamen/ornamenKilau.svg"],
  BenderaCheckpointSvg: [srcRoot, "ngaji-ceria-tilawati/svg/02-peta/benderaCheckpoint.svg"],
  IconGamesSvg: [srcRoot, "ngaji-ceria-tilawati/svg/03-ikon/iconGames.svg"],
  IconPlaySvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/02-glyph-ui/iconPlay.svg"],
  IconRedoSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/02-glyph-ui/iconRedo.svg"],
  IconScissorsSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/02-glyph-ui/iconScissors.svg"],
  IconStopSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/02-glyph-ui/iconStop.svg"],
  IconUndoSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/02-glyph-ui/iconUndo.svg"],
  IconMergeClipsSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/02-glyph-ui/iconMergeClips.svg"],
  IconPlayHeadMarkerSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/02-glyph-ui/iconPlayHeadMarker.svg"],
  IconCheckMarkSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/02-glyph-ui/iconCheckMark.svg"],
  MonsterGolemSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/01-karakter-battle/monsterGolem.svg"],
  MonsterPixelSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/01-karakter-battle/monsterPixel.svg"],
  MonsterSlimeSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/01-karakter-battle/monsterSlime.svg"],
  AvatarBoySvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/01-karakter-battle/avatarBoy.svg"],
  AvatarQirraSvg: [srcRoot, "ngaji-ceria-aset-battle-glyph/svg/01-karakter-battle/avatarQirra.svg"],
  BuildingRumahSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/buildingRumah.svg"],
  BuildingKelasSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/buildingKelas.svg"],
  BuildingMasjidSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/buildingMasjid.svg"],
  BuildingDapurSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/buildingDapur.svg"],
  BuildingPerpusSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/buildingPerpus.svg"],
  BuildingAsramaSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/buildingAsrama.svg"],
  MapGerbangSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/mapGerbang.svg"],
  MapLapanganSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/mapLapangan.svg"],
  MapRuangTamuSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/mapRuangTamu.svg"],
  MapTamanSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/mapTaman.svg"],
  MapMalamSvg: [srcRoot, "ngaji-ceria-aset-game/svg/02-bangunan-peta/mapMalam.svg"],
  ObstacleSemakSvg: [srcRoot, "ngaji-ceria-aset-game/svg/04-arcade/obstacleSemak.svg"],
  StepNiatSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepNiat.svg"],
  StepCuciTanganSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepCuciTangan.svg"],
  StepBerkumurSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepBerkumur.svg"],
  StepHirupAirSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepHirupAir.svg"],
  StepBasuhWajahSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepBasuhWajah.svg"],
  StepBasuhTanganSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepBasuhTangan.svg"],
  StepUsapKepalaSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepUsapKepala.svg"],
  StepBasuhKakiSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepBasuhKaki.svg"],
  StepDoaSelesaiSvg: [srcRoot, "ngaji-ceria-aset-game/svg/03-wudhu/stepDoaSelesai.svg"],
  IconSholatSubuhSvg: [srcRoot, "ngaji-ceria-aset-game/svg/01-ikon-sholat/iconSholatSubuh.svg"],
  IconSholatDzuhurSvg: [srcRoot, "ngaji-ceria-aset-game/svg/01-ikon-sholat/iconSholatDzuhur.svg"],
  IconSholatAsharSvg: [srcRoot, "ngaji-ceria-aset-game/svg/01-ikon-sholat/iconSholatAshar.svg"],
  IconSholatMaghribSvg: [srcRoot, "ngaji-ceria-aset-game/svg/01-ikon-sholat/iconSholatMaghrib.svg"],
  IconSholatIsyaSvg: [srcRoot, "ngaji-ceria-aset-game/svg/01-ikon-sholat/iconSholatIsya.svg"],
};

const camelize = (s) => s.replace(/[-:](\w)/g, (_, c) => c.toUpperCase());

function parseSvg(raw, compName) {
  let s = raw.trim();
  const vbMatch = s.match(/viewBox="([^"]+)"/);
  const viewBox = vbMatch ? vbMatch[1] : "0 0 200 200";
  // extract inner content between the first '>' after '<svg' and the last '</svg>'
  const openEnd = s.indexOf(">", s.indexOf("<svg")) + 1;
  const closeStart = s.lastIndexOf("</svg>");
  let inner = s.slice(openEnd, closeStart);
  // strip XML comments to keep the generated file lean
  inner = inner.replace(/<!--[\s\S]*?-->/g, "");
  // namespace def ids per component so gradients never collide across SVGs in the DOM
  inner = inner.replace(/id="([^"]+)"/g, `id="${compName}.$1"`);
  inner = inner.replace(/url\(#([^)]+)\)/g, `url(#${compName}.$1)`);
  inner = inner.replace(/href="#([^"]+)"/g, `href="#${compName}.$1"`);
  // escape backslashes, backticks and ${ for template literal embedding
  inner = inner.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  // aria label from root tag if present
  const labelMatch = s.slice(0, openEnd).match(/aria-label="([^"]*)"/);
  const viewBoxAttr = camelize(viewBox);
  return { viewBox, inner, label: labelMatch ? labelMatch[1] : compName, viewBoxAttr };
}

const lines = [];
lines.push(`import React from "react";`);
lines.push(``);
lines.push(`export interface AsetSvgProps {`);
lines.push(`  size?: number;`);
lines.push(`  className?: string;`);
lines.push(`  style?: React.CSSProperties;`);
lines.push(`  ariaLabel?: string;`);
lines.push(`}`);
lines.push(``);

for (const [compName, [dir, file]] of Object.entries(ASSETS)) {
  const path = [dir, file].join("/");
  if (!existsSync(path)) {
    console.error(`MISSING: ${path}`);
    continue;
  }
  const { viewBox, inner, label } = parseSvg(readFileSync(path, "utf8"), compName);
  const innerConst = `svg${compName}`;
  lines.push(`const ${innerConst} = \`${inner}\`;`);
  lines.push(``);
  lines.push(`export const ${compName}: React.FC<AsetSvgProps> = ({`);
  lines.push(`  size,`);
  lines.push(`  className,`);
  lines.push(`  style,`);
  lines.push(`  ariaLabel,`);
  lines.push(`}) => (`);
  lines.push(`  <svg`);
  lines.push(`    viewBox="${viewBox}"`);
  lines.push(`    width={size}`);
  lines.push(`    height={size}`);
  lines.push(`    className={className}`);
  lines.push(`    style={style}`);
  lines.push(`    role="img"`);
  lines.push(`    aria-label={ariaLabel ?? "${label.replace(/"/g, "&quot;")}"}`);
  lines.push(`    dangerouslySetInnerHTML={{ __html: ${innerConst} }}`);
  lines.push(`  />`);
  lines.push(`);`);
  lines.push(``);
}

writeFileSync("src/components/ui/tartilaAset.tsx", lines.join("\n"));
console.log("OK components generated:", Object.keys(ASSETS).length);
