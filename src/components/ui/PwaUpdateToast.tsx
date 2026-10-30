// src/components/ui/PwaUpdateToast.tsx
import { X } from "./CustomIcons";
import { StickerButton } from "./StickerButton";

export interface PwaUpdateToastProps {
  onDismiss: () => void;
  onReload: () => void;
}

export function PwaUpdateToast({ onDismiss, onReload }: PwaUpdateToastProps) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:left-auto md:right-24 w-auto z-50 flex flex-col gap-3 rounded-2xl border-[3px] border-[#134E4A] bg-white p-4 shadow-[4px_4px_0px_#134E4A] min-w-[240px]">
      <div className="flex items-start justify-between gap-3">
        <p className="font-black text-sm leading-snug text-[#134E4A]">
          Pembaruan aplikasi tersedia. Muat ulang agar perubahan disimpankan?
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup notifikasi pembaruan"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:scale-105"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex gap-3">
        <StickerButton
          variant="secondary"
          onClick={onDismiss}
          className="border-[#134E4A] text-[#134E4A] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none"
        >
          Nanti
        </StickerButton>
        <StickerButton
          variant="primary"
          onClick={onReload}
          className="border-[#134E4A] bg-white text-[#0D9488] shadow-[4px_4px_0px_#134E4A] active:translate-y-[2px] active:shadow-none"
        >
          Muat Ulang
        </StickerButton>
      </div>
    </div>
  );
}
