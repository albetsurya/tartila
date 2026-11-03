import assert from "node:assert/strict";
import {
  generateSlasherTarget,
  computeAdaptiveDifficulty,
} from "../src/features/ngaji-ceria/pages/games/harakat-slasher/hooks/useSlasherGame";
import {
  HARAKAT_LIST,
  HURUF_LIST,
} from "../src/features/ngaji-ceria/pages/games/harakat-slasher/data/harakat-list";

export const tests = {
  "generateSlasherTarget: menghasilkan target 1 karakter untuk targetLength = 1": () => {
    const target = generateSlasherTarget(HARAKAT_LIST, 1);
    assert.ok(target.symbol);
    assert.ok(target.name);
    // Tidak mengandung spasi pemisah karena hanya 1 item
    assert.equal(target.symbol.includes(" "), false);
  },

  "generateSlasherTarget: menggabungkan beberapa karakter dengan spasi untuk targetLength > 1": () => {
    const target2 = generateSlasherTarget(HURUF_LIST, 2);
    const parts2 = target2.symbol.split(" ");
    assert.equal(parts2.length, 2);

    const target5 = generateSlasherTarget(HURUF_LIST, 5);
    const parts5 = target5.symbol.split(" ");
    assert.equal(parts5.length, 5);
  },

  "computeAdaptiveDifficulty: percobaan < 3 mempertahankan nilai dasar": () => {
    const result = computeAdaptiveDifficulty({
      correctCount: 1,
      wrongCount: 1,
      baseFallSpeed: 10,
      baseDistractorRatio: 0.35,
      mode: "challenge",
    });
    assert.equal(result.fallSpeed, 10);
    assert.equal(result.distractorRatio, 0.35);
    assert.equal(result.rollingAccuracy, null);
    assert.equal(result.tier, "normal");
  },

  "computeAdaptiveDifficulty: akurasi < 60% menurunkan kesulitan dan menambah peluang target": () => {
    const resultPractice = computeAdaptiveDifficulty({
      correctCount: 1,
      wrongCount: 3, // 25% akurasi
      baseFallSpeed: 10,
      baseDistractorRatio: 0.4,
      mode: "practice",
    });
    assert.equal(resultPractice.tier, "easier");
    assert.equal(resultPractice.fallSpeed, 7.5); // 10 * 0.75
    assert.equal(resultPractice.distractorRatio, 0.24); // 0.4 * 0.6
    assert.ok(resultPractice.targetSpawnBonus > 0);

    const resultChallenge = computeAdaptiveDifficulty({
      correctCount: 1,
      wrongCount: 3, // 25% akurasi
      baseFallSpeed: 10,
      baseDistractorRatio: 0.4,
      mode: "challenge",
    });
    assert.equal(resultChallenge.tier, "easier");
    assert.equal(resultChallenge.fallSpeed, 8.5); // 10 * 0.85
    assert.equal(resultChallenge.distractorRatio, 0.28); // 0.4 * 0.7
  },

  "computeAdaptiveDifficulty: akurasi > 85% menaikkan kesulitan": () => {
    const result = computeAdaptiveDifficulty({
      correctCount: 9,
      wrongCount: 1, // 90% akurasi
      baseFallSpeed: 10,
      baseDistractorRatio: 0.35,
      mode: "challenge",
    });
    assert.equal(result.tier, "harder");
    assert.equal(result.fallSpeed, 11.5); // 10 * 1.15
    assert.equal(result.distractorRatio, 0.45); // min(0.6, 0.35 + 0.1)
  },

  "computeAdaptiveDifficulty: akurasi 60%-85% normal": () => {
    const result = computeAdaptiveDifficulty({
      correctCount: 7,
      wrongCount: 3, // 70% akurasi
      baseFallSpeed: 10,
      baseDistractorRatio: 0.35,
      mode: "challenge",
    });
    assert.equal(result.tier, "normal");
    assert.equal(result.fallSpeed, 10);
    assert.equal(result.distractorRatio, 0.35);
  },
};

