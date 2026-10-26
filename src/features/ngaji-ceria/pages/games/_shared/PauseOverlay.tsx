import { AppModal } from "@/components/ui/AppModal";
import { StickerButton } from "@/components/ui/StickerButton";

export function PauseOverlay({
  visible,
  onResume,
  onExit,
}: {
  visible: boolean;
  onResume: () => void;
  onExit: () => void;
}) {
  if (!visible) return null;
  return (
    <AppModal isOpen={true} title="Lagi Jeda" onClose={onResume}>
      <p className="mb-5 mt-2 text-sm text-white/70">
        Ambil napas dulu. Waktu dan permainan berhenti di sini.
      </p>
      <StickerButton variant="primary" size="lg" fullWidth onClick={onResume}>
        Lanjut
      </StickerButton>
      <StickerButton
        variant="secondary"
        size="lg"
        fullWidth
        className="mt-2"
        onClick={onExit}
      >
        Keluar
      </StickerButton>
    </AppModal>
  );
}
