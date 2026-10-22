import React from "react";
import { PlaySvg, LockSvg, StarSvg } from "@/components/ui/CustomIcons";

export interface GameCardProps {
  title: string;
  cover: React.ReactNode;
  description?: string;
  genre?: string;
  tagline?: string;
  onClick: () => void;
  locked?: boolean;
  best?: number;
  badge?: string;
  index?: number;
  layout?: "vertical" | "horizontal";
  bgColor?: string;
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  cover,
  description,
  genre,
  tagline,
  onClick,
  locked = false,
  best = 0,
  badge,
  index,
  layout = "vertical",
  bgColor = "bg-white",
  className = "",
}) => {
  const displayTag = tagline || genre || (index !== undefined ? `Mode ${index + 1}` : undefined);

  const renderCover = (sizeClass: string) => {
    if (typeof cover === "string") {
      return (
        <img
          src={cover}
          alt=""
          aria-hidden="true"
          className={`h-full w-full object-contain drop-shadow-[2px_2px_0px_#134E4A] transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3 ${
            locked ? "grayscale opacity-50" : ""
          }`}
          draggable={false}
        />
      );
    }
    return (
      <div
        className={`flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 group-hover:-rotate-3 ${
          locked ? "grayscale opacity-50" : ""
        }`}
      >
        {cover}
      </div>
    );
  };

  if (layout === "horizontal") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group relative flex w-full items-center justify-between overflow-hidden rounded-[24px] border-[3px] border-[#134E4A] p-4 text-left shadow-[4px_4px_0px_#134E4A] transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#134E4A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#134E4A] select-none ${bgColor} ${
          locked ? "opacity-85" : ""
        } ${className}`}
      >
        {/* Teks Kiri */}
        <div className="relative z-10 flex-1 pr-4">
          {displayTag && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-md border-[2px] border-[#134E4A] bg-white px-2 py-0.5 text-[9px] font-black text-[#134E4A] uppercase shadow-[1px_1px_0px_#134E4A]">
              {displayTag}
            </span>
          )}

          <h3 className="font-display text-lg font-black leading-tight text-[#134E4A]">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-[11px] font-bold text-[#134E4A]/70 line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-lg border-[2px] border-[#134E4A] px-3 py-1.5 text-[11px] font-black text-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all ${
                locked ? "bg-gray-400" : "bg-[#0D9488]"
              }`}
            >
              {locked ? (
                <>
                  <LockSvg size={12} /> Terkunci
                </>
              ) : (
                <>
                  <PlaySvg size={12} className="fill-white" /> Mainkan
                </>
              )}
            </span>

            {best > 0 && !locked && (
              <span className="inline-flex items-center gap-1 rounded-lg border-[2px] border-[#134E4A] bg-white px-2 py-1.5 text-[10px] font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                <StarSvg size={12} className="text-[#FF6B6B] fill-[#FF6B6B]" />{" "}
                {best}
              </span>
            )}
          </div>
        </div>

        {/* Gambar / Cover Kanan */}
        <div className="relative z-10 flex h-24 w-24 shrink-0 items-center justify-center">
          {renderCover("h-24 w-24")}
        </div>
      </button>
    );
  }

  // Layout Vertical (Default untuk Grid Game)
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center w-full rounded-[24px] border-[3px] border-[#134E4A] p-3 text-center overflow-hidden shadow-[4px_4px_0px_#134E4A] transition-all duration-150 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#134E4A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#134E4A] select-none ${bgColor} ${
        locked ? "opacity-80 grayscale-[25%]" : ""
      } ${className}`}
    >
      {/* Badge Top Left */}
      {locked ? (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-gray-200 px-2 py-0.5 text-[9px] font-black text-gray-700 border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
          <LockSvg size={10} /> TERKUNCI
        </div>
      ) : best > 0 ? (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-[#FEF3C7] px-2 py-0.5 text-[10px] font-black text-[#D97706] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
          <StarSvg size={10} className="fill-[#F59E0B]" /> {best}
        </div>
      ) : badge ? (
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1 rounded-md bg-[#DCFCE7] px-2 py-0.5 text-[9px] font-black text-[#134E4A] border-2 border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
          {badge}
        </div>
      ) : null}

      {/* Stage Cover Tengah */}
      <div className="relative z-10 mt-4 flex h-24 w-full items-center justify-center">
        {/* Lingkaran Ornamen Latar Belakang */}
        <div className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-[#F0FDF4] border-2 border-[#134E4A]/15" />
        <div className="relative z-10 flex items-center justify-center">
          {renderCover("h-20 w-20")}
        </div>
      </div>

      {/* Teks Judul & Genre */}
      <div className="mt-3 flex w-full flex-col items-center text-center z-10">
        <h3 className="font-display text-[15px] font-black leading-tight text-[#134E4A] line-clamp-1">
          {title}
        </h3>
        {displayTag && (
          <p className="mt-0.5 text-[10px] font-bold text-[#134E4A]/60 line-clamp-1">
            {displayTag}
          </p>
        )}
      </div>

      {/* Tombol Aksi di Bawah Kartu */}
      <div className="mt-3 w-full z-10">
        <span
          className={`flex w-full items-center justify-center gap-1.5 rounded-xl border-2 py-2 text-xs font-black transition-all ${
            locked
              ? "bg-gray-100 text-gray-500 border-gray-400"
              : "bg-[#FF6B6B] hover:bg-[#EE5A5A] text-white border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
          }`}
        >
          {locked ? (
            <>
              <LockSvg size={12} /> Terkunci
            </>
          ) : (
            <>
              <PlaySvg size={12} className="fill-white" /> Main
            </>
          )}
        </span>
      </div>
    </button>
  );
};

export default GameCard;
