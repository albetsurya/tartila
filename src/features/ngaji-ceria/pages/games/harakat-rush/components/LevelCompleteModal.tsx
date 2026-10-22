import { ModalPanel } from "../../_shared/ModalPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StickerButton } from "@/components/ui/StickerButton";
import { ArrowRight, Star } from "@/components/ui/CustomIcons";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { getLevelConfig } from "../data/levels";

export function LevelCompleteModal({
  visible,
  level,
  score,
  onNext,
  onExit,
}: {
  visible: boolean;
  level: number;
  score: number;
  onNext: () => void;
  onExit: () => void;
}) {
  if (!visible) return null;
  const current = getLevelConfig(level);
  const next = getLevelConfig(level + 1);

  return (
    <ModalPanel title="Level Selesai!" warm>
      <div className="mt-3 flex justify-center">
        <TilaMascot size={120} mood="excited" animation="bounce" />
      </div>

      <SectionHeader
        title={`Level ${current.id} · ${current.name}`}
        badge="Selesai"
        icon={<Star size={14} />}
        accent="amber"
        className="mt-2"
      />

      <div className="mb-4 rounded-xl border-[2px] border-[#F59E0B] bg-[#FEF3C7] p-3 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-[#B45309]">
          Skor
        </p>
        <p className="font-display text-3xl font-black text-[#B45309]">
          {score}
        </p>
      </div>

      <p className="mb-4 text-xs font-bold text-[#134E4A]/70">
        Lanjut ke{" "}
        <span className="font-black text-[#0D9488]">
          Level {next.id} · {next.name}
        </span>
        ?
      </p>

      <StickerButton variant="primary" size="lg" fullWidth onClick={onNext}>
        Lanjut <ArrowRight size={16} />
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
    </ModalPanel>
  );
}
