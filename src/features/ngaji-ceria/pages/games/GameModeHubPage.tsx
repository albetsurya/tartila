import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGameAccess } from "../../components/GameLockGuard";
import { useAuth } from "@/contexts/AuthContext";
import {
  useEconomyStore,
  isUnlimitedUser,
} from "@/features/ngaji-ceria/hooks/useEconomyStore";

export default function GameModeHubPage({
  hubOverride,
}: {
  hubOverride?: string;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, groupId } = useAuth();
  const isVip = useEconomyStore((s: any) => s.isVip);
  
  // Gunakan cast any untuk menghindari error tipe
  const isUnlimited = useEconomyStore((s: any) => 
    isUnlimitedUser(user as any, isVip, groupId as any)
  );

  const { tier } = useGameAccess("");
  const [promptOpen, setPromptOpen] = useState(false);
  const [energyEmpty, setEnergyEmpty] = useState(false);

  // ... sisanya komponen
  return null; // placeholder
}
