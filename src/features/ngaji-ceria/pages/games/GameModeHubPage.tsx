import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGameAccess } from "@/hooks/useGameAccess";
import { useAuth } from "@/contexts/AuthContext";
import { useEconomyStore } from "@/hooks/useEconomyStore";
import { HUBS } from "@/features/ngaji-ceria/data/hubData";

export default function GameModeHubPage() {
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
