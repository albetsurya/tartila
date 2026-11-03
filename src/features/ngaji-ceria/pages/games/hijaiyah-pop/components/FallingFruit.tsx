import React from "react";
import type { BalloonData } from "../hooks/useBalloonGame";
import {
  ItemBiruSvg,
  ItemMerahSvg,
  ItemKuningSvg,
  ItemHijauSvg,
  EfekPopSvg,
} from "@/components/ui/Illustrations";
import { normalizeArabicText } from "@/utils/arabic";

const ITEM_COMPONENTS = [
  ItemBiruSvg,
  ItemMerahSvg,
  ItemKuningSvg,
  ItemHijauSvg,
];

export function FallingFruit({
  fruit,
  disabled,
  reducedMotion = false,
  onPop,
}: {
  fruit: BalloonData;
  disabled: boolean;
  reducedMotion?: boolean;
  onPop: (fruit: BalloonData) => void;
}) {
  const ItemSvg =
    ITEM_COMPONENTS[Math.abs(fruit.color) % ITEM_COMPONENTS.length];
  const isTarget = fruit.isTarget;

  const handleTrigger = () => {
    if (disabled || fruit.popped) return;
    onPop(fruit);
  };

  // Buah benar: tersedot ke keranjang (bawah tengah) lalu mengecil dan masuk keranjang.
  const suckProgress = Math.min(fruit.popAge / 0.45, 1);
  const suckEase = suckProgress * suckProgress * (3 - 2 * suckProgress);
  // Buah salah: EfekPop membesar cepat, memudar dalam 0.5s.
  const isPoppingWrong = fruit.popped && !isTarget;
  const cleanLetter = normalizeArabicText(fruit.letter);

  return (
    <button
      type="button"
      data-fruit-letter={cleanLetter}
      data-fruit-target={fruit.isTarget}
      aria-label={`Buah huruf ${cleanLetter}`}
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
      className="absolute left-0 top-0 h-28 min-w-[5.5rem] w-fit p-1.5 touch-none select-none flex items-center justify-center cursor-pointer"
      style={{
        transform: reducedMotion
          ? `translate3d(${fruit.x}px, ${fruit.y}px, 0)`
          : isPoppingWrong
            ? `translate3d(${fruit.x}px, ${fruit.y}px, 0) scale(${
                1 + fruit.popAge * 2
              })`
            : fruit.popped
              ? `translate3d(${fruit.x + fruit.suckX * suckEase}px, ${
                  fruit.y + fruit.suckY * suckEase
                }px, 0) scale(${Math.max(0.05, 1 - 0.85 * suckEase)})`
              : `translate3d(${fruit.x}px, ${fruit.y}px, 0) scale(1)`,
        opacity: reducedMotion
          ? fruit.popped
            ? Math.max(0, 1 - fruit.popAge / 0.35)
            : 1
          : isPoppingWrong
            ? Math.max(0, 1 - fruit.popAge * 2)
            : fruit.popped
              ? suckProgress >= 1
                ? 0
                : Math.max(0, 1 - Math.max(0, fruit.popAge - 0.35) * 10)
              : 1,
        willChange: "transform",
      }}
    >
      {fruit.isRotten ? (
        fruit.popped ? (
          <div className="h-full w-full flex items-center justify-center">
            {reducedMotion ? (
              <div className="h-14 w-14 rounded-2xl border-[3px] border-[#134E4A] bg-[#4B5563] opacity-50" />
            ) : (
              <EfekPopSvg size={84} className="h-full w-full object-contain" />
            )}
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 rounded-2xl border-[3.5px] border-[#134E4A] bg-[#4B5563] shadow-[3px_4px_0px_#134E4A] flex flex-col items-center justify-center gap-0.5">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-wider text-[#FEE2E2]">
                BUSUK
              </span>
            </div>
          </div>
        )
      ) : fruit.popped ? (
        isPoppingWrong ? (
          <div className="h-full w-full flex items-center justify-center">
            {reducedMotion ? (
              <ItemSvg
                size={80}
                className="h-full w-full object-contain opacity-50"
              />
            ) : (
              <EfekPopSvg size={84} className="h-full w-full object-contain" />
            )}
          </div>
        ) : (
          <div className="relative h-full w-full flex items-center justify-center">
            <ItemSvg
              size={80}
              className="h-full w-full object-contain drop-shadow-[3px_4px_0_#134E4A]"
            />
            {/* HTML Overlay Neo-Brutalism */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-[#FFFBEB] border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] rounded-full px-3 py-1 min-h-[34px] w-fit flex items-center justify-center">
                <span
                  dir="rtl"
                  className={`font-arabic font-black whitespace-nowrap text-[#134E4A] leading-normal ${
                    cleanLetter.length <= 2 ? "text-xl" : "text-sm sm:text-base"
                  }`}
                >
                  {cleanLetter}
                </span>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="relative h-full w-full flex items-center justify-center">
          <ItemSvg
            size={80}
            className="h-full w-full object-contain drop-shadow-[3px_4px_0_#134E4A]"
          />
          {/* HTML Overlay Neo-Brutalism */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`bg-[#FFFBEB] border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] rounded-full px-3 py-1 min-h-[34px] w-fit flex items-center justify-center ${
                fruit.showHint && fruit.isTarget
                  ? "ring-4 ring-[#10B981] shadow-[0_0_12px_#10B981]"
                  : ""
              }`}
            >
              <span
                dir="rtl"
                className={`font-arabic font-black whitespace-nowrap text-[#134E4A] leading-normal ${
                  cleanLetter.length <= 2 ? "text-xl" : "text-sm sm:text-base"
                }`}
              >
                {cleanLetter}
              </span>
            </div>
          </div>
        </div>
      )}
    </button>
  );
}
