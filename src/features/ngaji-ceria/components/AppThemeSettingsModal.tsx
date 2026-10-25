import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  SparklesSvg,
  CheckSvg,
  XSvg,
  LockSvg,
  StoreSvg,
} from "@/components/ui/CustomIcons";
import { useAppTheme } from "../hooks/useAppTheme";
import { playSfx } from "../pages/games/_shared/audio";
import { tapFeedback } from "@/lib/haptics";

interface AppThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppThemeSettingsModal({
  isOpen,
  onClose,
}: AppThemeSettingsModalProps) {
  const navigate = useNavigate();
  const { themes, equippedAppTheme, ownedAppThemes, equipAppTheme } = useAppTheme();

  if (!isOpen) return null;

  const handleSelectTheme = (id: string) => {
    if (id === equippedAppTheme) return;
    tapFeedback(20);
    playSfx("pop");
    equipAppTheme(id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#134E4A]/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 320 }}
          className="relative w-full max-w-md rounded-[28px] border-[3px] border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] text-[var(--text-main,#134E4A)] p-5 shadow-[6px_6px_0px_var(--shadow-color,#134E4A)] z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b-2 border-[var(--border-color,#134E4A)]/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#FEF08A] flex items-center justify-center shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] shrink-0">
                <SparklesSvg size={22} className="text-[#B45309]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-black text-[var(--text-main,#134E4A)] leading-tight">
                  Pengaturan Tampilan
                </h2>
                <p className="text-[11px] font-bold text-[var(--text-main,#134E4A)]/60 mt-0.5">
                  Ubah warna tema utama aplikasi Tartila
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border-2 border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFF0F0)] p-1.5 text-[var(--text-main,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none transition-all"
              aria-label="Tutup modal"
            >
              <XSvg size={18} />
            </button>
          </div>

          {/* Theme Grid */}
          <div className="overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin">
            {themes.map((theme) => {
              const isOwned = ownedAppThemes.includes(theme.id) || theme.id === "default";
              const isEquipped = equippedAppTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => {
                    if (isOwned) handleSelectTheme(theme.id);
                  }}
                  className={`rounded-2xl border-[3px] p-3.5 flex items-center justify-between gap-3 transition-all ${
                    isEquipped
                      ? "border-[var(--border-color,#134E4A)] bg-[var(--bg-app,#F0FDF4)] shadow-[3px_3px_0px_var(--shadow-color,#134E4A)]"
                      : isOwned
                      ? "border-[var(--border-color,#134E4A)] bg-[var(--bg-card,#FFFFFF)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                      : "border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 opacity-70"
                  }`}
                >
                  {/* Swatch & Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] shrink-0 flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: theme.bgHex }}
                    >
                      <div
                        className="w-6 h-6 rounded-full border border-black/20 shadow-sm"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-sm text-[var(--text-main,#134E4A)] truncate">
                          {theme.name}
                        </h3>
                        {theme.id === "default" && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                            Bawaan
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-[var(--text-main,#134E4A)]/60 line-clamp-1 mt-0.5">
                        {theme.desc}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    {isEquipped ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0D9488] text-white text-xs font-black border-2 border-[var(--border-color,#134E4A)] shadow-[1px_1px_0px_var(--shadow-color,#134E4A)]">
                        <CheckSvg size={14} />
                        <span>Aktif</span>
                      </span>
                    ) : isOwned ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTheme(theme.id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0D9488] text-white text-xs font-black border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] active:translate-y-[1px] active:shadow-none transition-all hover:bg-[#0F766E] cursor-pointer"
                      >
                        Pakai
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          navigate("/member/ngaji-ceria/warung-santri?tab=app");
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#FEF3C7] text-[#B45309] text-xs font-black border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all hover:bg-[#FDE68A]"
                      >
                        <LockSvg size={12} />
                        <span>{theme.price} Koin</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t-2 border-gray-100 flex items-center justify-between text-xs font-bold text-[#134E4A]/60">
            <span>Koleksi tema lebih banyak di Warung</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate("/member/ngaji-ceria/warung-santri?tab=app");
              }}
              className="text-[#0D9488] hover:underline font-black flex items-center gap-1"
            >
              <StoreSvg size={13} />
              <span>Buka Warung</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
