import assert from "node:assert/strict";
import { normalizeArabicText } from "../src/utils/arabic.ts";

export const tests = {
  "normalizeArabicText: menghapus tatweel dari huruf he (هـ -> ه)": () => {
    assert.equal(normalizeArabicText("هـ"), "ه");
    assert.equal(normalizeArabicText("ـهـ"), "ه");
  },
  "normalizeArabicText: menghapus zero-width characters": () => {
    assert.equal(normalizeArabicText("\u200Cب\u200D"), "ب");
    assert.equal(normalizeArabicText("\uFEFFم"), "م");
  },
  "normalizeArabicText: mempertahankan harakat": () => {
    assert.equal(normalizeArabicText("بَ"), "بَ");
    assert.equal(normalizeArabicText("سِ"), "سِ");
    assert.equal(normalizeArabicText("تُ"), "تُ");
  },
  "normalizeArabicText: memangkas whitespace": () => {
    assert.equal(normalizeArabicText("  ج   "), "ج");
  },
};
