import { StickerButton } from "@/components/ui/StickerButton";
import { Lightbulb } from "@/components/ui/CustomIcons"; // Asumsi ada icon ini, atau hapus jika tidak perlu

export function HintButton({
  left,
  disabled,
  onClick,
}: {
  left: number;
  disabled: boolean;
  onClick: () => void;
}) {
  const isDisabled = disabled || left <= 0;

  return (
    <StickerButton
      variant="secondary" // Putih dengan border tebal
      size="lg" // Ukuran besar agar proporsional
      disabled={isDisabled}
      onClick={onClick}
      className="px-6" // Sedikit penyesuaian lebar
    >
      {/* Opsional: tambahkan icon bohlam jika ada */}
      <span className="font-black">Hint ({left})</span>
    </StickerButton>
  );
}
