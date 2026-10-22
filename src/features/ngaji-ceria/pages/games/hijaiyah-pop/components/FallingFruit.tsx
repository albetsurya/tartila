import React from "react";
import type { BalloonData } from "../hooks/useBalloonGame"; // Tipe data bisa disesuaikan nanti
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

  const handleTrigger = () => {
    if (disabled || fruit.popped) return;
    onPop(fruit);
  };

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
        transform: `translate3d(${fruit.x}px, ${fruit.y}px, 0) scale(${
          fruit.popped ? 1 + fruit.popAge * 3 : 1
        })`,
        opacity: fruit.popped ? 1 - fruit.popAge * 5 : 1,
        willChange: "transform",
      }}
    >
      {fruit.popped ? (
        <div className="h-full w-full flex items-center justify-center">
          <EfekPopSvg size={84} className="h-full w-full object-contain" />
        </div>
      ) : (
        <div className="relative h-full w-full flex items-center justify-center">
          <ItemSvg
            size={80}
            className="h-full w-full object-contain drop-shadow-[2px_2px_0px_#134E4A]"
          />
          <span className="game-arabic absolute inset-0 flex items-center justify-center pt-2 text-center text-3xl font-black text-[#134E4A] select-none pointer-events-none">
            {fruit.letter}
          </span>
        </div>
      )}
    </button>
  );
}
