import assert from "node:assert/strict";
import {
  generateSlasherTarget,
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
    const target2 = generateSlasherTarget(HARAKAT_LIST, 2);
    const parts2 = target2.symbol.split(" ");
    assert.equal(parts2.length, 2);

    const target5 = generateSlasherTarget(HURUF_LIST, 5);
    const parts5 = target5.symbol.split(" ");
    assert.equal(parts5.length, 5);
  },
};

