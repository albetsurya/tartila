import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PaletteSvg,
  CheckSvg,
  XSvg,
  LockSvg,
  StoreSvg,
  GamepadSvg,
  ZapSvg,
  StarSvg,
  SparklesSvg,
} from "@/components/ui/CustomIcons";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { playSfx } from "../pages/games/_shared/audio";
import { tapFeedback } from "@/lib/haptics";

interface GameThemeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const GAME_THEME_ITEMS = [
  {
    id: "default",
    name: "Tema Ceria (Klasik)",
    desc: "Warna klasik hijau tosca ceria khas permainan Tartila.",
    price: 0,
    swatch: "#0D9488",
    bgClass: "bg-[#F0FDF4]",
    accentColor: "#0D9488",
    icon: GamepadSvg,
  },
  {
    id: "neon",
    name: "Neon Cyberpunk",
    desc: "Arena gelap elektromagnetik berhias aksen biru neon elektrik.",
    price: 300,
    swatch: "#38BDF8",
    bgClass: "bg-[#111827]",
    accentColor: "#38BDF8",
    icon: ZapSvg,
  },
  {
    id: "retro",
    name: "Retro Arcade",
    desc: "Nostalgia konsol klasik 8-bit berlatar hangat dan garis tegas.",
    price: 300,
    swatch: "#F59E0B",
    bgClass: "bg-[#FFFBEB]",
    accentColor: "#B45309",
    icon: StarSvg,
  },
  {
    id: "pastel",
    name: "Pastel Ceria",
    desc: "Sentuhan merah muda lembut yang tenang, manis, dan ramah santri.",
    price: 400,
    swatch: "#F9A8D4",
    bgClass: "bg-[#FCE7F3]",
    accentColor: "#EC4899",
    icon: SparklesSvg,
  },
];

export function GameThemeSheet({ isOpen, onClose }: GameThemeSheetProps) {
  const navigate = useNavigate();
  const equippedGameTheme = useEconomyStore((s) => s.equippedGameTheme) || "default";
  const ownedGameThemes = useEconomyStore((s) => s.ownedGameThemes) || ["default"];
  const equipGameTheme = useEconomyStore((s) => s.equipGameTheme);

  if (!isOpen) return null;

  const handleSelectTheme = (id: string) => {
    if (id === equippedGameTheme) return;
    tapFeedback(20);
    playSfx("pop");
    equipGameTheme(id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#134E4A]/60 backdrop-blur-sm"
        />

        {/* Sheet / Modal Container */}
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
          className="relative w-full max-w-md rounded-t-[32px] sm:rounded-[28px] border-t-[3.5px] sm:border-[3px] border-[#134E4A] bg-white p-5 shadow-[0px_-8px_0px_#134E4A] sm:shadow-[6px_6px_0px_#134E4A] z-10 max-h-[85vh] flex flex-col"
        >
          {/* Grab Bar for mobile */}
          <div className="w-12 h-1.5 rounded-full bg-gray-300 mx-auto mb-3 sm:hidden" />

          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF08A] flex items-center justify-center shadow-[2px_2px_0px_#134E4A] shrink-0">
                <PaletteSvg size={22} />
              </div>
              <div>
                <h2 className="font-display text-lg font-black text-[#134E4A] leading-tight">
                  Tema Game
                </h2>
                <p className="text-[11px] font-bold text-[#134E4A]/60 mt-0.5">
                  Pilih nuansa warna untuk seluruh arena game
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-[#134E4A] bg-[#FFF0F0] p-1.5 text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all hover:bg-[#FFE0E0]"
              aria-label="Tutup sheet"
            >
              <XSvg size={18} />
            </button>
          </div>

          {/* Theme List */}
          <div className="overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin">
            {GAME_THEME_ITEMS.map((item) => {
              const isOwned = ownedGameThemes.includes(item.id) || item.id === "default";
              const isEquipped = equippedGameTheme === item.id;
              const Icon = item.icon;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (isOwned) handleSelectTheme(item.id);
                  }}
                  className={`rounded-2xl border-[3px] p-3.5 flex items-center justify-between gap-3 transition-all ${
                    isEquipped
                      ? "border-[#134E4A] bg-[#F0FDF4] shadow-[3px_3px_0px_#134E4A]"
                      : isOwned
                      ? "border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] hover:bg-gray-50 cursor-pointer"
                      : "border-dashed border-gray-300 bg-gray-50 opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-12 h-12 rounded-xl border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] shrink-0 flex items-center justify-center ${item.bgClass}`}
                    >
                      <Icon size={22} style={{ color: item.accentColor }} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-sm text-[#134E4A] truncate">
                          {item.name}
                        </h3>
                        {item.id === "default" && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-300">
                            Bawaan
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-[#134E4A]/60 line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isEquipped ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#134E4A] text-white text-xs font-black border border-[#134E4A] shadow-[1px_1px_0px_#134E4A]">
                        <CheckSvg size={14} />
                        <span>Aktif</span>
                      </span>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTheme(item.id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0D9488] text-white text-xs font-black border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all hover:bg-[#0F766E]"
                      >
                        Pakai
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          navigate("/member/ngaji-ceria/warung-santri?tab=game");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FEF3C7] text-[#B45309] text-xs font-black border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all hover:bg-[#FDE68A]"
                      >
                        <LockSvg size={12} />
                        <span>{item.price} Koin</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t-2 border-gray-100 flex items-center justify-between text-xs font-bold text-[#134E4A]/60">
            <span>Beli tema lebih banyak di Warung</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/member/ngaji-ceria/warung-santri?tab=game");
              }}
              className="text-[#0D9488] hover:underline font-black flex items-center gap-1"
            >
              <StoreSvg size={13} />
              <span>Warung Santri</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
