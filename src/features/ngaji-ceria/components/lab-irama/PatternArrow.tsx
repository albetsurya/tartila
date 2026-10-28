import React from 'react';

export type PatternArrowType = "1-datar" | "2-datar-turun" | "3-datar-naik-turun" | "4-datar-naik-naik-turun";

export function PatternArrow({ type }: { type: PatternArrowType }) {
  return (
    <div className="flex items-center gap-1 border-[3px] border-[#134E4A] bg-white p-2 rounded-xl shadow-[4px_4px_0px_#134E4A]">
      <span className="text-[#0D9488] font-black text-xl">→</span>
      {type !== "1-datar" && (
        <span className="text-[#F59E0B] font-black text-xl">↗</span>
      )}
      {type === "4-datar-naik-naik-turun" && (
        <span className="text-[#F59E0B] font-black text-xl">↗</span>
      )}
      {type !== "1-datar" && (
        <span className="text-[#FF6B6B] font-black text-xl">↘</span>
      )}
    </div>
  );
}