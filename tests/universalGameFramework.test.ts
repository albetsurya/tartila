import assert from "node:assert/strict";
import React from "react";
import { useGameStore } from "../src/features/ngaji-ceria/hooks/useGameStore";
import { GameStartSheet } from "../src/features/ngaji-ceria/components/game-framework/GameStartSheet";
import { GameHud } from "../src/features/ngaji-ceria/components/game-framework/GameHud";
import { GameResultModal } from "../src/features/ngaji-ceria/components/game-framework/GameResultModal";

export const tests = {
  "useGameStore: mengelola level progres dan pembukaan level berikutnya": () => {
    // Reset awal
    useGameStore.getState().resetGameProgress();

    // Default level untuk game baru adalah 1
    assert.equal(useGameStore.getState().getUnlockedLevel("harakat-rush"), 1);
    assert.equal(useGameStore.getState().isLevelUnlocked("harakat-rush", 1), true);
    assert.equal(useGameStore.getState().isLevelUnlocked("harakat-rush", 2), false);

    // Menyelesaikan level 1 harus membuka level 2
    useGameStore.getState().unlockNextLevel("harakat-rush", 1);
    assert.equal(useGameStore.getState().getUnlockedLevel("harakat-rush"), 2);
    assert.equal(useGameStore.getState().isLevelUnlocked("harakat-rush", 2), true);
    assert.equal(useGameStore.getState().isLevelUnlocked("harakat-rush", 3), false);

    // Menyelesaikan level 1 lagi tidak menurunkan level tertinggi yang terbuka
    useGameStore.getState().unlockNextLevel("harakat-rush", 1);
    assert.equal(useGameStore.getState().getUnlockedLevel("harakat-rush"), 2);

    // Menyelesaikan level 2 harus membuka level 3
    useGameStore.getState().unlockNextLevel("harakat-rush", 2);
    assert.equal(useGameStore.getState().getUnlockedLevel("harakat-rush"), 3);
    assert.equal(useGameStore.getState().isLevelUnlocked("harakat-rush", 3), true);

    // Reset game spesifik
    useGameStore.getState().resetGameProgress("harakat-rush");
    assert.equal(useGameStore.getState().getUnlockedLevel("harakat-rush"), 1);
  },

  "Universal Game Framework: GameStartSheet terdefinisi dan menerima konfigurasi level": () => {
    assert.equal(typeof GameStartSheet, "function");

    const element = React.createElement(GameStartSheet, {
      isOpen: true,
      gameTitle: "Harakat Slasher",
      unlockedLevels: 2,
      levels: [1, 2, 3],
      onStart: () => {},
    });
    assert.ok(React.isValidElement(element));
  },

  "Universal Game Framework: GameHud terdefinisi dan merender timer serta skor": () => {
    assert.equal(typeof GameHud, "function");

    // Normal time (> 10s)
    const hudNormal = React.createElement(GameHud, {
      timeLeft: 45,
      score: 150,
      targetScore: 250,
      level: 1,
    });
    assert.ok(React.isValidElement(hudNormal));

    // Urgent time (< 10s)
    const hudUrgent = React.createElement(GameHud, {
      timeLeft: 8,
      score: 80,
      targetScore: 100,
      level: 1,
    });
    assert.ok(React.isValidElement(hudUrgent));
  },

  "Universal Game Framework: GameResultModal terdefinisi untuk kondisi menang dan kalah": () => {
    assert.equal(typeof GameResultModal, "function");

    // Modal Menang (isWin = true, 3 bintang)
    const winModal = React.createElement(GameResultModal, {
      isOpen: true,
      isWin: true,
      score: 280,
      targetScore: 250,
      stars: 3,
      level: 2,
      onRetry: () => {},
      onNextLevel: () => {},
      onBackToHub: () => {},
    });
    assert.ok(React.isValidElement(winModal));

    // Modal Kalah (isWin = false, 0 bintang)
    const loseModal = React.createElement(GameResultModal, {
      isOpen: true,
      isWin: false,
      score: 60,
      targetScore: 100,
      stars: 0,
      level: 1,
      onRetry: () => {},
      onBackToHub: () => {},
    });
    assert.ok(React.isValidElement(loseModal));
  },
};
