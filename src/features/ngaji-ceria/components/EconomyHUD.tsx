import { useEffect } from "react";
import {
  HEART_MAX,
  TICKET_MAX,
  useEconomyStore,
} from "../hooks/useEconomyStore";
import { NGAJI_CERIA_ASSETS } from "../data/assets";

function Pill({
  src,
  alt,
  bg,
  children,
}: {
  src: string;
  alt: string;
  bg: string;
  children: string;
}) {
  return (
    <div
      className={`flex items-center gap-1 rounded-full ${bg} px-2.5 py-1 border border-[#134E4A]/15 font-bold text-xs shadow-sm`}
    >
      <img src={src} alt={alt} className="w-4 h-4 object-contain" />
      <span>{children}</span>
    </div>
  );
}

export function EconomyHUD({ className = "" }: { className?: string }) {
  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const syncTime = useEconomyStore((s) => s.syncTime);

  useEffect(() => {
    syncTime();
    const id = window.setInterval(syncTime, 60_000);
    return () => window.clearInterval(id);
  }, [syncTime]);

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Pill
        src={NGAJI_CERIA_ASSETS.hatiNyawa}
        alt="Hati"
        bg="bg-coral-soft text-coral-glow"
      >
        {isVip ? "∞" : `${hearts}/${HEART_MAX}`}
      </Pill>
      <Pill
        src={NGAJI_CERIA_ASSETS.iconGames}
        alt="Tiket"
        bg="bg-[#FEF3C7] text-deep-teal"
      >
        {isVip ? "∞" : `${tickets}/${TICKET_MAX}`}
      </Pill>
      {isVip && (
        <Pill
          src={NGAJI_CERIA_ASSETS.mahkotaVip}
          alt="VIP"
          bg="bg-[#FEF3C7] text-[#B45309]"
        >
          VIP
        </Pill>
      )}
    </div>
  );
}
