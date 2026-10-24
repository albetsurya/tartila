// Assets import for Ngaji Ceria using SVG asset suite
import * as NEW from "../../../assets/ngaji-ceria-new/index";

export const NGAJI_CERIA_ASSETS = {
  // HUD Elements
  bintang: NEW.bintangPenuh,
  bintangKosong: NEW.bintangKosong,
  bukuQuran: NEW.bukuJuzAmma,
  hatiNyawa: NEW.hatiNyawa,
  koinHijaiyah: NEW.koinHijaiyah,
  mahkotaVip: NEW.mahkotaVip,
  peci: NEW.ornamenPeci,
  apiStreak: NEW.apiStreak,
  apiStreakMati: NEW.apiStreakMati,

  // Map / Path / Chests
  benderaCheckpoint: NEW.benderaCheckpoint,
  petiHarta: NEW.petiHarta,
  petiHartaTerbuka: NEW.petiHartaTerbuka,

  // Books / Jilid
  jilidCovers: {
    1: NEW.bukuTilawatiJilid1,
    2: NEW.bukuTilawatiJilid2,
    3: NEW.bukuTilawatiJilid3,
    4: NEW.bukuTilawatiJilid4,
    5: NEW.bukuTilawatiJilid5,
    6: NEW.bukuTilawatiJilid6,
  } as Record<number, string>,
  bukuJuzAmma: NEW.bukuJuzAmma,

  // Kartu Kuis
  kartuMatchCocok: NEW.kartuMatchCocok,
  tebakSurahBaru: NEW.tebakSurahBaru,

  // UI Dock / TopBar
  topBarLatar: NEW.topBarLatar,

  // Characters / Avatar
  avatarAnak: NEW.avatarAnak,
  avatarAnakBersorak: NEW.avatarAnakBersorak,
  avatarBoy: NEW.avatarBoy,
  avatarQirra: NEW.avatarQirra,

  // Map buildings & decor
  buildingMasjid: NEW.buildingMasjid,
  buildingKelas: NEW.buildingKelas,
  buildingAsrama: NEW.buildingAsrama,
  buildingPerpus: NEW.buildingPerpus,
  buildingDapur: NEW.buildingDapur,
  buildingRumah: NEW.buildingRumah,
  mapGerbang: NEW.mapGerbang,
  mapLapangan: NEW.mapLapangan,
  mapRuangTamu: NEW.mapRuangTamu,
  mapTaman: NEW.mapTaman,
  mapMalam: NEW.mapMalam,
  obstacleSemak: NEW.obstacleSemak,

  // Wudhu steps
  stepNiat: NEW.stepNiat,
  stepCuciTangan: NEW.stepCuciTangan,
  stepBerkumur: NEW.stepBerkumur,
  stepHirupAir: NEW.stepHirupAir,
  stepBasuhWajah: NEW.stepBasuhWajah,
  stepBasuhTangan: NEW.stepBasuhTangan,
  stepUsapKepala: NEW.stepUsapKepala,
  stepBasuhKaki: NEW.stepBasuhKaki,
  stepDoaSelesai: NEW.stepDoaSelesai,

  // Monsters
  monsterGolem: NEW.monsterGolem,
  monsterPixel: NEW.monsterPixel,
  monsterSlime: NEW.monsterSlime,

  // UI Icons & Timeline Editor Glyphs
  iconCheckMark: NEW.iconCheckMark,
  iconGames: NEW.iconGames,
  iconMergeClips: NEW.iconMergeClips,
  iconPlay: NEW.iconPlay,
  iconPlayHeadMarker: NEW.iconPlayHeadMarker,
  iconRedo: NEW.iconRedo,
  iconScissors: NEW.iconScissors,
  iconStop: NEW.iconStop,
  iconUndo: NEW.iconUndo,
  konfeti: NEW.ornamenKilau,
};
