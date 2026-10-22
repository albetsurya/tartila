import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ModalPanel } from "../pages/games/_shared/ModalPanel";
import { StickerButton } from "@/components/ui";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { Coins, Crown } from "@/components/ui/CustomIcons";
import {
  HEART_REGEN_MS,
  TICKET_REGEN_MS,
  useEconomyStore,
  isUnlimitedUser,
  type EnergyKind,
} from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";

function formatWait(now: number, lastRegen: number, interval: number): string {
  const elapsed = Math.max(0, now - lastRegen);
  const remain = interval - (elapsed % interval);
  const totalMinutes = Math.max(1, Math.ceil(remain / 60_000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours} jam ${minutes} menit`;
  return `${minutes} menit`;
}

export function OutOfEnergyModal({
  visible,
  type,
  onClose,
}: {
  visible: boolean;
  type: EnergyKind;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { user, groupId } = useAuth();
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, groupId);
  const lastHeartRegen = useEconomyStore((s) => s.lastHeartRegen);
  const lastTicketRegen = useEconomyStore((s) => s.lastTicketRegen);
  const syncTime = useEconomyStore((s) => s.syncTime);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!visible || isUnlimited) return;
    syncTime();
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [visible, isUnlimited, syncTime]);

  if (!visible || isUnlimited) return null;

  const isHeart = type === "heart";
  const wait = isHeart
    ? formatWait(now, lastHeartRegen, HEART_REGEN_MS)
    : formatWait(now, lastTicketRegen, TICKET_REGEN_MS);

  return (
    <ModalPanel title={isHeart ? "Hati Habis!" : "Tiket Habis!"} warm onClose={onClose}>
      <div className="my-4 flex flex-col items-center text-center">
        <TilaMascot size={120} mood="sad" direction="front" animation="float" />

        <p className="mt-4 text-sm font-bold text-[#134E4A]/70">
          {isHeart
            ? "Energi belajarmu sudah habis."
            : "Tiket bermainmu sudah habis."}{" "}
          Tunggu <span className="font-black text-[#FF6B6B]">{wait}</span> lagi,
          atau tukar Koin di Warung Santri.
        </p>

        <div className="mt-5 w-full space-y-2">
          <StickerButton variant="secondary" fullWidth onClick={onClose}>
            Tunggu Dulu
          </StickerButton>
          <StickerButton
            variant="primary"
            fullWidth
            onClick={() => navigate("/member/ngaji-ceria/warung-santri")}
          >
            <Coins size={16} /> Tukar Koin
          </StickerButton>
          <StickerButton
            variant="coral-outline"
            fullWidth
            onClick={() => navigate("/member/ngaji-ceria/premium")}
          >
            <Crown size={16} /> Buka VIP
          </StickerButton>
        </div>
      </div>
    </ModalPanel>
  );
}
