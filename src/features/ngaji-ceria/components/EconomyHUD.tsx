import { useEffect } from "react";
import {
  HEART_MAX,
  TICKET_MAX,
  useEconomyStore,
  isUnlimitedUser,
} from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
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
      className={`flex items-center gap-1 rounded-full ${bg} px-2.5 py-1 border-2 border-[#134E4A] font-bold text-xs shadow-[2px_2px_0px_#134E4A]`}
    >
      <img src={src} alt={alt} className="w-4 h-4 object-contain" />
      <span>{children}</span>
    </div>
  );
}

export function EconomyHUD({ className = "" }: { className?: string }) {
  const { user, groupId } = useAuth();
  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const syncTime = useEconomyStore((s) => s.syncTime);
  const isUnlimited = isUnlimitedUser(user, isVip, groupId);

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
        {isUnlimited ? "∞" : `${hearts}/${HEART_MAX}`}
      </Pill>
      <Pill
        src={NGAJI_CERIA_ASSETS.iconGames}
        alt="Tiket"
        bg="bg-[#FEF3C7] text-deep-teal"
      >
        {isUnlimited ? "∞" : `${tickets}/${TICKET_MAX}`}
      </Pill>
      {isUnlimited && (
        <Pill
          src={NGAJI_CERIA_ASSETS.mahkotaVip}
          alt="Unlimited"
          bg="bg-[#FEF3C7] text-[#B45309]"
        >
          {isVip ? "VIP" : "∞"}
        </Pill>
      )}
    </div>
  );
}
