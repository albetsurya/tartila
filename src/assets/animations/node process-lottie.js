const fs = require("fs");
const path = require("path");

// 1. Baca file fatih.json
const inputPath = "./fatih.json";
const outputPath = "./fatih-animated.json";
const lottie = JSON.parse(fs.readFileSync(inputPath, "utf8"));

// 2. Set Canvas & Frame Rate (1024x1024, 30fps, 120 frames = 4 detik)
lottie.w = 1024;
lottie.h = 1024;
lottie.fr = 30;
lottie.ip = 0;
lottie.op = 120;

// Helper untuk mereset properti animasi menjadi statis ("a": 0)
function resetProp(prop, defaultVal = null) {
  if (!prop) return;
  if (prop.a === 1 && Array.isArray(prop.k) && prop.k.length > 0) {
    // Ambil nilai keyframe terakhir jika itu adalah animasi intro (seperti opacity 0->100 atau scale 50->100)
    const firstKf = prop.k[0].s;
    const lastKf = prop.k[prop.k.length - 1].s;
    const chosen = defaultVal !== null ? defaultVal : lastKf || firstKf;
    prop.a = 0;
    prop.k = Array.isArray(chosen) && chosen.length === 1 ? chosen[0] : chosen;
  }
  delete prop.t;
  delete prop.s;
  delete prop.i;
  delete prop.o;
}

function cleanTransform(tr) {
  if (!tr) return;
  resetProp(tr.o, 100); // Pastikan objek terlihat penuh (opacity 100)
  resetProp(tr.s, [100, 100]); // Pastikan ukuran normal (scale 100%)
  resetProp(tr.r, 0);
  resetProp(tr.p);
  resetProp(tr.a);
  resetProp(tr.sk, 0);
  resetProp(tr.sa, 0);
}

function cleanShapes(items) {
  if (!Array.isArray(items)) return;
  for (const item of items) {
    if (item.ty === "tr") {
      cleanTransform(item);
    } else if (item.ty === "gr" && Array.isArray(item.it)) {
      cleanShapes(item.it);
    }
  }
}

// 3. Hapus layer background penuh (ind: 274)
lottie.layers = lottie.layers.filter((layer) => layer.ind !== 274);

// 4. Bersihkan semua animasi lama pada setiap layer
for (const layer of lottie.layers) {
  layer.ip = 0;
  layer.op = 120;
  layer.st = 0;
  delete layer.parent;
  cleanTransform(layer.ks);
  cleanShapes(layer.shapes);
}

// 5. Daftar pengelompokan layer berdasarkan koordinat artwork fatih.json
const confettiInds = new Set([
  ...Array.from({ length: 64 }, (_, i) => i), // ind 0 - 63 (Bintang, bulan, pita confetti)
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
]);

const groundInds = new Set([87, 88, 89, 90, 91, 92]); // Garis lantai/tanah tetap diam

const leftHandInds = new Set([
  95, 98, 124, 127, 130, 153, 154, 155, 156, 220, 264, 265, 267, 268,
]);

const rightHandInds = new Set([
  122, 126, 133, 138, 139, 140, 141, 147, 148, 258, 270,
]);

// Easing presets
const easeInOut2D = {
  i: { x: [0.42, 0.42], y: [1, 1] },
  o: { x: [0.58, 0.58], y: [0, 0] },
};
const easeInOut1D = {
  i: { x: [0.42], y: [1] },
  o: { x: [0.58], y: [0] },
};
const linear2D = {
  i: { x: [0.5, 0.5], y: [0.5, 0.5] },
  o: { x: [0.5, 0.5], y: [0.5, 0.5] },
};
const linear1D = {
  i: { x: [0.5], y: [0.5] },
  o: { x: [0.5], y: [0.5] },
};

// 6. Buat Null Layer untuk Karakter & Kedua Tangan
const CHAR_ROOT_IND = 1000;
const LEFT_HAND_IND = 1001;
const RIGHT_HAND_IND = 1002;

const characterRootNull = {
  ddd: 0,
  ind: CHAR_ROOT_IND,
  ty: 3,
  nm: "Character_Root",
  sr: 1,
  ks: {
    o: { a: 0, k: 100 },
    r: { a: 0, k: 0 },
    p: {
      a: 1,
      k: [
        { t: 0, s: [512, 600], ...easeInOut2D },
        { t: 60, s: [512, 596], ...easeInOut2D },
        { t: 120, s: [512, 600] },
      ],
    },
    a: { a: 0, k: [512, 600] },
    s: {
      a: 1,
      k: [
        { t: 0, s: [100, 100], ...easeInOut2D },
        { t: 60, s: [101.5, 101.5], ...easeInOut2D },
        { t: 120, s: [100, 100] },
      ],
    },
  },
  ao: 0,
  ip: 0,
  op: 120,
  st: 0,
};

const leftHandNull = {
  ddd: 0,
  ind: LEFT_HAND_IND,
  ty: 3,
  nm: "Left_Hand_Rig",
  parent: CHAR_ROOT_IND,
  sr: 1,
  ks: {
    o: { a: 0, k: 100 },
    r: {
      a: 1,
      k: [
        { t: 0, s: [0], ...easeInOut1D },
        { t: 30, s: [3], ...easeInOut1D },
        { t: 60, s: [-2], ...easeInOut1D },
        { t: 90, s: [2], ...easeInOut1D },
        { t: 120, s: [0] },
      ],
    },
    p: {
      a: 1,
      k: [
        { t: 0, s: [175, 430], ...easeInOut2D },
        { t: 30, s: [175, 424], ...easeInOut2D },
        { t: 60, s: [175, 432], ...easeInOut2D },
        { t: 90, s: [175, 426], ...easeInOut2D },
        { t: 120, s: [175, 430] },
      ],
    },
    a: { a: 0, k: [175, 430] },
    s: { a: 0, k: [100, 100] },
  },
  ao: 0,
  ip: 0,
  op: 120,
  st: 0,
};

const rightHandNull = {
  ddd: 0,
  ind: RIGHT_HAND_IND,
  ty: 3,
  nm: "Right_Hand_Rig",
  parent: CHAR_ROOT_IND,
  sr: 1,
  ks: {
    o: { a: 0, k: 100 },
    r: {
      a: 1,
      k: [
        { t: 0, s: [0], ...easeInOut1D },
        { t: 30, s: [-3], ...easeInOut1D },
        { t: 60, s: [2], ...easeInOut1D },
        { t: 90, s: [-2], ...easeInOut1D },
        { t: 120, s: [0] },
      ],
    },
    p: {
      a: 1,
      k: [
        { t: 0, s: [885, 450], ...easeInOut2D },
        { t: 30, s: [885, 454], ...easeInOut2D },
        { t: 60, s: [885, 444], ...easeInOut2D },
        { t: 90, s: [885, 452], ...easeInOut2D },
        { t: 120, s: [885, 450] },
      ],
    },
    a: { a: 0, k: [885, 450] },
    s: { a: 0, k: [100, 100] },
  },
  ao: 0,
  ip: 0,
  op: 120,
  st: 0,
};

// 7. Terapkan Animasi Confetti & Parenting Karakter
let confettiCounter = 0;

for (const layer of lottie.layers) {
  const ind = layer.ind;

  if (confettiInds.has(ind)) {
    // Cari grup transform di dalam shape untuk mendapatkan titik tengah asli perca
    const gr = layer.shapes?.[0];
    const tr = gr?.it?.find((item) => item.ty === "tr");
    const anchor = tr?.a?.k || [512, 200];
    const origX = anchor[0];
    const origY = anchor[1];

    // Stagger/fase jatuh berbeda untuk setiap perca (tetapi pasangan fill+outline punya fase sama jika berdekatan)
    const groupIdx = Math.floor(confettiCounter / 2);
    confettiCounter++;

    const startY = -140 - (groupIdx % 5) * 20;
    const endY = 1120 + (groupIdx % 4) * 25;
    const totalDist = endY - startY;

    // Offset waktu agar jatuhnya tersebar merata (staggered loop)
    const splitFrame = ((groupIdx * 17) % 96) + 12; // Antara frame 12 s/d 108
    const progressAt0 = (120 - splitFrame) / 120;
    const midY = Math.round(startY + totalDist * progressAt0);
    const driftX = (groupIdx % 2 === 0 ? 1 : -1) * (15 + (groupIdx % 3) * 10);
    const maxRot = groupIdx % 2 === 0 ? 360 : 720;
    const midRot = Math.round(maxRot * progressAt0);

    if (tr) {
      // Animasi jatuh yang mulus dan seamless dari frame 0 ke 120
      const fFadeOut = Math.max(1, splitFrame - 4);
      const fReset = splitFrame;
      const fFadeIn = Math.min(119, splitFrame + 5);

      tr.p = {
        a: 1,
        k: [
          { t: 0, s: [origX, midY], ...linear2D },
          { t: fFadeOut, s: [origX + driftX, endY], ...linear2D },
          { t: fReset, s: [origX - driftX, startY], ...linear2D },
          { t: 120, s: [origX, midY] },
        ],
      };

      tr.r = {
        a: 1,
        k: [
          { t: 0, s: [midRot], ...linear1D },
          { t: fFadeOut, s: [maxRot], ...linear1D },
          { t: fReset, s: [0], ...linear1D },
          { t: 120, s: [midRot] },
        ],
      };

      tr.o = {
        a: 1,
        k: [
          { t: 0, s: [100], ...linear1D },
          { t: Math.max(0, fFadeOut - 6), s: [100], ...linear1D },
          { t: fFadeOut, s: [0], ...linear1D },
          { t: fReset, s: [0], ...linear1D },
          { t: fFadeIn, s: [100], ...linear1D },
          { t: 120, s: [100] },
        ],
      };
    }
  } else if (groundInds.has(ind)) {
    // Tanah tetap statis
    continue;
  } else if (leftHandInds.has(ind)) {
    layer.parent = LEFT_HAND_IND;
  } else if (rightHandInds.has(ind)) {
    layer.parent = RIGHT_HAND_IND;
  } else {
    // Seluruh bagian tubuh, kepala, sorban, dan jubah ikut bernapas dengan Character_Root
    layer.parent = CHAR_ROOT_IND;
  }
}

// Tambahkan Null Rigging ke daftar layer
lottie.layers.unshift(characterRootNull, leftHandNull, rightHandNull);

// 8. Simpan hasil JSON
fs.writeFileSync(outputPath, JSON.stringify(lottie));
console.log("Berhasil! File disimpan di:", outputPath);
