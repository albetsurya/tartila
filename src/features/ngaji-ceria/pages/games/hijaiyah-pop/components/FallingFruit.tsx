import React from "react";
import type { BalloonData } from "../hooks/useBalloonGame";
import {
  ItemBiruSvg,
  ItemMerahSvg,
  ItemKuningSvg,
  ItemHijauSvg,
  EfekPopSvg,
} from "@/components/ui/Illustrations";

const ITEM_COMPONENTS = [
  ItemBiruSvg,
  ItemMerahSvg,
  ItemKuningSvg,
  ItemHijauSvg,
];

export function FallingFruit({
  fruit,
  disabled,
  onPop,
}: {
  fruit: BalloonData;
  disabled: boolean;
  onPop: (fruit: BalloonData) => void;
}) {
  const ItemSvg =
    ITEM_COMPONENTS[Math.abs(fruit.color) % ITEM_COMPONENTS.length];
  const isTarget = fruit.isTarget;

  const handleTrigger = () => {
    if (disabled || fruit.popped) return;
    onPop(fruit);
  };

  // Buah benar: tersedot ke keranjang (bawah tengah) lalu mengecil dan hilang.
  const suckProgress = Math.min(fruit.popAge / 0.45, 1);
  const suckEase = suckProgress * suckProgress * (3 - 2 * suckProgress);
  // Buah salah: EfekPop membesar cepat, memudar dalam 0.5s.
  const isPoppingWrong = fruit.popped && !isTarget;

  return (
    <button
      data-fruit-letter={fruit.letter}
      data-fruit-target={fruit.isTarget}
      aria-label={`Buah huruf ${fruit.letter}`}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse" || event.button === 0) {
          event.preventDefault();
          handleTrigger();
        }
      }}
      onClick={(event) => {
        if (event.detail === 0) handleTrigger();
      }}
      disabled={disabled || fruit.popped}
      className="absolute left-0 top-0 h-24 w-20 touch-none select-none flex items-center justify-center cursor-pointer"
      style={{
        transform: isPoppingWrong
          ? `translate3d(${fruit.x}px, ${fruit.y}px, 0) scale(${
              1 + fruit.popAge * 2
            })`
          : fruit.popped
            ? `translate3d(${fruit.x + fruit.suckX * suckEase}px, ${
                fruit.y + fruit.suckY * suckEase
              }px, 0) scale(${1 - 0.85 * suckEase})`
            : `translate3d(${fruit.x}px, ${fruit.y}px, 0) scale(1)`,
        opacity: isPoppingWrong
          ? Math.max(0, 1 - fruit.popAge * 2)
          : fruit.popped
            ? suckProgress >= 1
              ? 0
              : Math.max(0, 1 - Math.max(0, fruit.popAge - 0.4) * 10)
            : 1,
        willChange: "transform",
      }}
    >
      {fruit.popped ? (
        isPoppingWrong ? (
          <div className="h-full w-full flex items-center justify-center">
            <EfekPopSvg size={84} className="h-full w-full object-contain" />
          </div>
        ) : null
      ) : (
        <div className="relative h-full w-full flex items-center justify-center">
          <ItemSvg
            size={80}
            className="h-full w-full object-contain drop-shadow-[3px_4px_0_rgba(15,23,42,1)]"
          />
          <span className="game-arabic absolute inset-0 flex items-center justify-center pt-2 text-center text-3xl font-black text-[#134E4A] select-none pointer-events-none">
            {fruit.letter}
          </span>
        </div>
      )}
    </button>
  );
}
