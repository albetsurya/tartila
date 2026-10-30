import type { ReactNode } from "react";
import { LockSvg } from "@/components/ui/CustomIcons";
import { AppBottomSheet } from "@/components/ui/AppBottomSheet";

export interface GameLevelItem {
  id: number;
  title: string;
  description: string;
}

/**
 * Sheet pilih level standar (list vertikal neo-brutalism) untuk semua game
 * halaman Mini Games. Satu kolom, ramah jempol: kiri nomor level, tengah
 * judul + deskripsi, kanan tombol "Main" atau ikon gembok.
 */
export function GameLevelSelectSheet({
  isOpen,
  onClose,
  gameTitle,
  gameIcon,
  levels,
  unlockedCount,
  onSelectLevel,
}: {
  isOpen: boolean;
  onClose: () => void;
  gameTitle: string;
  gameIcon: ReactNode;
  levels: GameLevelItem[];
  unlockedCount: number;
  onSelectLevel: (index: number) => void;
}) {
  return (
    <AppBottomSheet isOpen={isOpen} onClose={onClose} title={gameTitle}>
      <div className="px-5 pb-2 pt-1">
        {/* Header: ikon game, judul, indikator level terbuka */}
        <div className="mb-4 flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-[#134E4A] text-[#FEF08A] shadow-[2px_2px_0px_#134E4A]">
            {gameIcon}
          </div>
          <div>
            <h3 className="font-display text-base font-black text-[#134E4A]">
              {gameTitle}
            </h3>
            <p className="text-xs text-[#64748B]">
              Jumlah level terbuka: {unlockedCount}/{levels.length}
            </p>
          </div>
        </div>

        {/* Daftar Level — list vertikal (psikologi anak: ramah jempol) */}
        {/* overflow-y-auto: 6 level bisa melebihi layar; panel AppBottomSheet
            sudah punya max-h-[88dvh], di sini max-h[60vh] menjaga sheet tetap
            compact dengan scroll internal. */}
        <div className="overflow-y-auto max-h-[60vh]">
          {levels.map((level, idx) => {
            const isUnlocked = idx < unlockedCount;

            return (
              <div
                key={level.id}
                className={`flex flex-row items-center justify-between gap-3 rounded-2xl border-[3px] border-[#134E4A] p-3 mb-3 shadow-[3px_3px_0px_#134E4A] ${
                  isUnlocked ? "bg-[#DCFCE7]" : "bg-[#F1F5F9] opacity-60"
                }`}
              >
                {/* Kiri: kotak nomor level */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black border border-[#134E4A] ${
                    isUnlocked
                      ? "bg-[#FEF08A] text-[#7C2D12]"
                      : "bg-[#E2E8F0] text-[#94A3B8]"
                  }`}
                >
                  {level.id}
                </div>

                {/* Tengah: judul & deskripsi */}
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-sm font-black text-[#134E4A] truncate">
                    {level.title}
                  </div>
                  <div className="text-xs text-[#64748B] truncate">
                    {level.description}
                  </div>
                </div>

                {/* Kanan: tombol Main atau gembok */}
                {isUnlocked ? (
                  <button
                    type="button"
                    onClick={() => onSelectLevel(idx)}
                    className="shrink-0 rounded-lg bg-[#0D9488] px-4 py-1.5 text-xs font-black text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] hover:bg-[#0F766E] transition-all cursor-pointer"
                  >
                    Main
                  </button>
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                    <LockSvg size={18} className="text-[#94A3B8]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppBottomSheet>
  );
}
