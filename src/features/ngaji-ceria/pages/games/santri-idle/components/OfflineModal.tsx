import { AppModal } from "@/components/ui/AppModal";
import { formatIdleNumber } from "../data/buildings";

export function OfflineModal({ gain, onClose }: { gain: number; onClose: () => void }) {
  if (!gain) return null;
  return <AppModal isOpen={true} title="Pesantren tetap berjalan" onClose={onClose}><p className="mt-2 text-sm text-white/75">Saat kamu pergi, kegiatan pesantren menghasilkan</p><p className="my-5 font-display text-4xl font-black text-rose-300">+{formatIdleNumber(gain)} santri</p><button type="button" onClick={onClose} className="game-button w-full bg-rose-500">Lanjut</button></AppModal>;
}
