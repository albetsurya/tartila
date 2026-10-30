import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { StickerButton, StickerCard, SectionHeader } from "@/components/ui";
import { AppModal } from "@/components/ui/AppModal";
import {
  staggerContainerVariants,
  staggerItemVariants,
} from "@/lib/animationVariants";
import {
  CoinSvg,
  SparklesSvg,
  ZapSvg,
  ShirtSvg,
  GlassesSvg,
  SnowflakeSvg,
  CrownSvg,
  CheckSvg,
  HomeSvg,
  GamepadSvg,
  MoonSvg,
  StarSvg,
  HeartSvg,
  TicketSvg,
  GraduationCapSvg,
  TurbanSvg,
  WizardHatSvg,
  HeadphoneSvg,
  SleepMaskSvg,
  HairbowSvg,
  PaletteSvg,
  SunSvg,
} from "@/components/ui/CustomIcons";
import { ChevronLeft, Info } from "@/components/ui/CustomIcons";
import {
  PetiHartaSvg,
  AvatarSantriSvg,
  type AvatarSantriAccessory,
} from "@/components/ui/Illustrations";
import { playSfx } from "./games/_shared/audio";
import { tapFeedback } from "@/lib/haptics";
import {
  ENERGY_PRICES,
  HEART_MAX,
  SHOP_DAILY_LIMIT,
  TICKET_MAX,
  useEconomyStore,
  isUnlimitedUser,
  type EnergyKind,
} from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeRole, isTartilaAdmin } from "@/lib/roles";
import { getProgress, subscribeProgress } from "./games/_shared/progression";
import { getMascotName, resolveMascotGender } from "@/utils/mascotHelper";
import { TilaMascot } from "@/components/ui/TilaMascot";
import {
  SKIN_ITEMS,
  type SkinItem,
  type SkinRarity,
  RARITY_ORDER,
} from "../data/shopData";

function useCoinsBalance(): number {
  const [coins, setCoins] = useState(() => getProgress().coins);
  useEffect(() => subscribeProgress(() => setCoins(getProgress().coins)), []);
  return coins;
}

type ShopTab =
  | "energi"
  | "skin"
  | "kostum"
  | "avatar"
  | "kamar"
  | "app"
  | "booster";

const TAB_ITEMS: Array<{
  key: ShopTab;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  activeColor: string;
}> = [
  {
    key: "energi",
    label: "Energi",
    icon: ZapSvg,
    activeColor: "bg-[#0D9488] text-white",
  },
  {
    key: "skin",
    label: "Skin",
    icon: SparklesSvg,
    activeColor: "bg-[#059669] text-white",
  },
  {
    key: "kostum",
    label: "Kostum",
    icon: ShirtSvg,
    activeColor: "bg-[#FF6B6B] text-white",
  },
  {
    key: "avatar",
    label: "Aksesoris Avatar",
    icon: GraduationCapSvg,
    activeColor: "bg-[#0284C7] text-white",
  },
  {
    key: "kamar",
    label: "Tema Kamar",
    icon: HomeSvg,
    activeColor: "bg-[#8B5CF6] text-white",
  },
  {
    key: "app",
    label: "Tema Aplikasi",
    icon: PaletteSvg,
    activeColor: "bg-[#0D9488] text-white",
  },
  {
    key: "booster",
    label: "Booster",
    icon: ZapSvg,
    activeColor: "bg-[#F59E0B] text-white",
  },
];

interface ThemeItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  iconComponent: React.ComponentType<{ size?: number; className?: string }>;
  iconColor: string;
  badgeBg: string;
  swatch: string;
}

const ROOM_THEMES: ThemeItem[] = [
  {
    id: "default",
    name: "Classic Room",
    desc: "Kamar klasik Tartila yang hangat: gratis untuk semua santri.",
    price: 0,
    iconComponent: HomeSvg,
    iconColor: "text-[#0D9488]",
    badgeBg: "bg-[#F0FDF4]",
    swatch: "#F0FDF4",
  },
  {
    id: "galaksi",
    name: "Milky Way Galaxy",
    desc: "Tidur di antara planet dan bintang berkilau.",
    price: 500,
    iconComponent: MoonSvg,
    iconColor: "text-[#6D28D9]",
    badgeBg: "bg-[#EDE9FE]",
    swatch: "#1E1B4B",
  },
  {
    id: "hutan",
    name: "Rainforest Jungle",
    desc: "Suasana hijau segar dengan pepohonan rimbun.",
    price: 500,
    iconComponent: SparklesSvg,
    iconColor: "text-[#15803D]",
    badgeBg: "bg-[#DCFCE7]",
    swatch: "#166534",
  },
  {
    id: "istana",
    name: "Sand Palace",
    desc: "Karpet merah dan kastil mini ala bangsawan.",
    price: 800,
    iconComponent: StarSvg,
    iconColor: "text-[#B45309]",
    badgeBg: "bg-[#FEF3C7]",
    swatch: "#E7C59E",
  },
];

const APP_THEMES: ThemeItem[] = [
  {
    id: "default",
    name: "Emerald Classic",
    desc: "Pengalaman Tartila orisinal. Segar dan natural.",
    price: 0,
    iconComponent: SparklesSvg,
    iconColor: "text-[#0D9488]",
    badgeBg: "bg-[#DCFCE7]",
    swatch: "#0D9488",
  },
  {
    id: "sky",
    name: "Azure Sky",
    desc: "Langit biru cerah, segar dan menenangkan.",
    price: 250,
    iconComponent: SunSvg,
    iconColor: "text-[#0284C7]",
    badgeBg: "bg-[#E0F2FE]",
    swatch: "#0284C7",
  },
  {
    id: "rose",
    name: "Cherry Blossom",
    desc: "Estetika merah muda manis untuk suasana hati yang indah.",
    price: 250,
    iconComponent: HeartSvg,
    iconColor: "text-[#E11D48]",
    badgeBg: "bg-[#FFE4E6]",
    swatch: "#E11D48",
  },
  {
    id: "gold",
    name: "Royal Gold",
    desc: "Aksen emas mewah untuk sang juara sejati.",
    price: 300,
    iconComponent: StarSvg,
    iconColor: "text-[#CA8A04]",
    badgeBg: "bg-[#FEF9C3]",
    swatch: "#CA8A04",
  },
  {
    id: "retro",
    name: "Retro Arcade",
    desc: "Gaya konsol klasik vintage.",
    price: 300,
    iconComponent: StarSvg,
    iconColor: "text-[#B45309]",
    badgeBg: "bg-[#FFFBEB]",
    swatch: "#F59E0B",
  },
  {
    id: "pastel",
    name: "Sweet Pastel",
    desc: "Mimpi pastel yang lembut dan berwarna-warni.",
    price: 400,
    iconComponent: SparklesSvg,
    iconColor: "text-[#EC4899]",
    badgeBg: "bg-[#FCE7F3]",
    swatch: "#F9A8D4",
  },
];

const ACCESSORY_ITEMS = [
  {
    id: "turban",
    name: "Santri Turban",
    desc: "Sorban putih dililitkan di kepala, cocok untuk semua karakter.",
    iconComponent: TurbanSvg,
    price: 150,
    accent: "cream",
  },
  {
    id: "wizardhat",
    name: "Wizard Hat",
    desc: "Topi kerucut ungu berhias bintang emas.",
    iconComponent: WizardHatSvg,
    price: 250,
    accent: "purple",
  },
  {
    id: "headphone",
    name: "DJ Headphones",
    desc: "Headphone merah muda untuk sesi belajar yang seru.",
    iconComponent: HeadphoneSvg,
    price: 300,
    accent: "pink",
  },
  {
    id: "sleepmask",
    name: "Sleep Mask",
    desc: "Penutup mata biru bermotif Zzz untuk istirahat Tito.",
    iconComponent: SleepMaskSvg,
    price: 100,
    accent: "sky",
  },
];

export interface AvatarAccessoryShopItem {
  id: AvatarSantriAccessory;
  name: string;
  desc: string;
  price: number;
  gender: "all" | "boy" | "girl";
}

export const AVATAR_ACCESSORY_SHOP_ITEMS: AvatarAccessoryShopItem[] = [
  {
    id: "peci",
    name: "Peci",
    desc: "Peci santri klasik khas Nusantara.",
    price: 0,
    gender: "boy",
  },
  {
    id: "hairbow",
    name: "Santri Hair Bow",
    desc: "Pita rambut manis dengan ikatan rapi.",
    price: 100,
    gender: "girl",
  },
  {
    id: "flowercrown",
    name: "Flower Crown",
    desc: "Karangan bunga segar yang bermekaran cerah.",
    price: 150,
    gender: "girl",
  },
  {
    id: "glasses",
    name: "Glasses",
    desc: "Kacamata baca untuk santri tekun mencari ilmu.",
    price: 120,
    gender: "all",
  },
  {
    id: "crown",
    name: "Champion Crown",
    desc: "Mahkota emas lambang juara tilawah.",
    price: 300,
    gender: "all",
  },
  {
    id: "wizardhat",
    name: "Wizard Hat",
    desc: "Topi kerucut berhias bintang emas.",
    price: 200,
    gender: "all",
  },
  {
    id: "headphone",
    name: "Headphones",
    desc: "Headphone nyaman untuk mendengar murottal merdu.",
    price: 250,
    gender: "all",
  },
  {
    id: "sleepmask",
    name: "Sleep Mask",
    desc: "Penutup mata biru bermotif zzz untuk istirahat setelah tadarus.",
    price: 80,
    gender: "all",
  },
  {
    id: "scarf",
    name: "Neck Scarf",
    desc: "Syal rajut pelindung santri dari dinginnya udara subuh.",
    price: 100,
    gender: "all",
  },
  {
    id: "turban",
    name: "Arabian Turban",
    desc: "Sorban lilitan kepala yang anggun dan berwibawa.",
    price: 180,
    gender: "boy",
  },
  {
    id: "sunglasses",
    name: "Sunglasses",
    desc: "Kacamata hitam kasual pelindung dari terik matahari.",
    price: 140,
    gender: "all",
  },
  {
    id: "chain",
    name: "Gold Chain",
    desc: "Kalung liontin bintang emas yang berkilau.",
    price: 220,
    gender: "girl",
  },
  {
    id: "star",
    name: "Gold Star",
    desc: "Pin bintang emas penanda santri teladan.",
    price: 160,
    gender: "all",
  },
  {
    id: "medal",
    name: "Honor Medal",
    desc: "Medali kehormatan khusus untuk khatam Al-Quran.",
    price: 280,
    gender: "all",
  },
  {
    id: "bandana",
    name: "Red Bandana",
    desc: "Bandana merah penyala semangat belajar Al-Quran.",
    price: 110,
    gender: "girl",
  },
];

const ENERGY_ITEMS: Array<{
  kind: EnergyKind;
  name: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: "coral" | "amber";
  max: number;
}> = [
  {
    kind: "heart",
    name: "1 Study Heart",
    desc: "Untuk masuk sesi belajar Tilawati.",
    icon: HeartSvg,
    accent: "coral",
    max: HEART_MAX,
  },
  {
    kind: "ticket",
    name: "1 Play Ticket",
    desc: "Untuk masuk Mini Games.",
    icon: TicketSvg,
    accent: "amber",
    max: TICKET_MAX,
  },
];

const COSTUME_ITEMS = [
  {
    id: "peci",
    name: "Peci",
    desc: "Songkok hitam berhias sulam emas khas santri berjiwa luhur.",
    iconComponent: GraduationCapSvg,
    price: 200,
    accent: "teal",
    category: "boy" as const,
    gender: "boy" as const,
  },
  {
    id: "hairbow",
    name: "Hair Bow",
    desc: "Pita cantik berwarna merah muda yang manis dan anggun.",
    iconComponent: HairbowSvg,
    price: 200,
    accent: "coral",
    category: "girl" as const,
    gender: "girl" as const,
  },
  {
    id: "flowercrown",
    name: "Flower Crown",
    desc: "Karangan bunga aneka warna yang segar, ceria, dan mempesona.",
    iconComponent: CrownSvg,
    price: 300,
    accent: "amber",
    category: "girl" as const,
    gender: "girl" as const,
  },
  {
    id: "glasses",
    name: "Glasses",
    desc: "Kacamata bulat stylish pembawa semangat belajar tekun.",
    iconComponent: GlassesSvg,
    price: 500,
    accent: "sky",
    category: "all" as const,
    gender: "all" as const,
  },
  {
    id: "crown",
    name: "Champion Crown",
    desc: "Mahkota emas gemerlap tanda santri istiqomah berprestasi.",
    iconComponent: CrownSvg,
    price: 1000,
    accent: "amber",
    category: "all" as const,
    gender: "all" as const,
  },
];

const BOOSTER_ITEMS = [
  {
    id: "double-exp",
    name: "Double EXP (2x)",
    desc: "Dapatkan 2x EXP untuk setiap kuis yang diselesaikan.",
    iconComponent: ZapSvg,
    price: 100,
    accent: "amber",
  },
  {
    id: "full-heart",
    name: "Instant Full Hearts",
    desc: "Isi ulang instan 5 Hati belajar tanpa menunggu.",
    iconComponent: HeartSvg,
    price: 300,
    accent: "coral",
  },
  {
    id: "streak-freeze",
    name: "Streak Freeze",
    desc: "Lindungi streak istiqomahmu agar tidak putus jika absen sehari.",
    iconComponent: SnowflakeSvg,
    price: 150,
    accent: "sky",
  },
];

function ThemeShopList({
  items,
  coinsBalance,
  ownedIds,
  equippedId,
  isSuperAdmin = false,
  onToggle,
}: {
  items: ThemeItem[];
  coinsBalance: number;
  ownedIds: string[];
  equippedId: string;
  isSuperAdmin?: boolean;
  onToggle: (item: ThemeItem) => void;
}) {
  return (
    <div className="space-y-4 mt-4 pb-8">
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {items.map((item) => {
          const isOwned = ownedIds.includes(item.id) || item.id === "default";
          const isEquipped = equippedId === item.id;
          const Icon = item.iconComponent;
          const affordable = isSuperAdmin || coinsBalance >= item.price;

          return (
            <motion.div key={item.id} variants={staggerItemVariants}>
              <StickerCard className="flex items-center gap-3.5 p-4">
                <div
                  className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] overflow-hidden"
                  style={{ backgroundColor: item.swatch }}
                >
                  <Icon size={26} className={item.iconColor} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-[var(--text-main,#134E4A)]">
                      {item.name}
                    </h3>
                    {item.price === 0 ? (
                      <span className="text-[9px] font-extrabold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded-md border border-[var(--border-color,#134E4A)]">
                        Gratis
                      </span>
                    ) : null}
                    {isEquipped && (
                      <span className="text-[9px] font-extrabold bg-[#134E4A] text-white px-2 py-0.5 rounded-md border border-[var(--border-color,#134E4A)]">
                        Dipakaikan
                      </span>
                    )}
                    {isOwned && !isEquipped && (
                      <span className="text-[9px] font-extrabold bg-[#0D9488]/20 text-[#0D9488] px-2 py-0.5 rounded-md border border-[#0D9488]">
                        Dimiliki
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/60 mt-0.5">
                    {item.desc}
                  </p>
                </div>

                {isEquipped ? (
                  <span className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#134E4A] text-white text-xs font-black border-2 border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]">
                    <CheckSvg size={12} /> Dipakaikan
                  </span>
                ) : isOwned ? (
                  <StickerButton
                    variant="primary"
                    size="sm"
                    className="shrink-0"
                    onClick={() => onToggle(item)}
                  >
                    Pakaikan
                  </StickerButton>
                ) : (
                  <StickerButton
                    variant={affordable ? "primary" : "secondary"}
                    size="sm"
                    pulse={affordable}
                    className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                    disabled={!affordable}
                    onClick={() => onToggle(item)}
                  >
                    {isSuperAdmin ? (
                      <span className="text-[#0D9488]">Gratis</span>
                    ) : (
                      <>
                        <CoinSvg size={14} /> {item.price}
                      </>
                    )}
                  </StickerButton>
                )}
              </StickerCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

interface SkinCardProps {
  item: SkinItem;
  isOwned: boolean;
  isEquipped: boolean;
  isTicket: boolean;
  affordable: boolean;
  isSuperAdmin: boolean;
  isUnlimited: boolean;
  onPreview: (item: SkinItem) => void;
  onBuy: (item: SkinItem) => void;
}

const SkinCard = memo(function SkinCard({
  item,
  isOwned,
  isEquipped,
  isTicket,
  affordable,
  isSuperAdmin,
  isUnlimited,
  onPreview,
  onBuy,
}: SkinCardProps) {
  const isMythic = item.rarity === "Mythic";
  const isLegendary = item.rarity === "Legendary";
  const isEpic = item.rarity === "Epic";

  const cardBorderClass = isMythic
    ? "border-[3px] border-amber-400 dark:border-amber-400 bg-white shadow-[4px_4px_0px_#9333EA] ring-2 ring-amber-400/50 hover:shadow-[6px_6px_0px_#9333EA]"
    : isLegendary
      ? "border-[3px] border-amber-500 dark:border-amber-400 bg-white shadow-[4px_4px_0px_#D97706] ring-1 ring-amber-400/40 hover:shadow-[6px_6px_0px_#D97706]"
      : isEpic
        ? "border-[3px] border-purple-500 dark:border-purple-400 bg-white shadow-[4px_4px_0px_#7C3AED] ring-1 ring-purple-400/40 hover:shadow-[6px_6px_0px_#7C3AED]"
        : "border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A] hover:shadow-[6px_6px_0px_#134E4A]";

  return (
    <motion.div
      className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all hover:translate-y-[-2px] ${cardBorderClass}`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
          <span
            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border-2 ${item.badgeBg}`}
          >
            {item.rarity || item.badgeText || "KLASIK"}
          </span>
          {isEquipped ? (
            <span className="text-[10px] font-black bg-[#134E4A] text-white px-2.5 py-0.5 rounded-md border-2 border-[#134E4A] flex items-center gap-1 shadow-[1px_1px_0px_#134E4A]">
              <CheckSvg size={12} /> Dipakaikan
            </span>
          ) : isOwned ? (
            <span className="text-[10px] font-black bg-[#CCFBF1] dark:bg-[#064E3B]/60 text-[#0F766E] dark:text-[#5EEAD4] px-2.5 py-0.5 rounded-md border-2 border-[#0F766E]">
              Dimiliki
            </span>
          ) : null}
        </div>

        <h3 className="font-display text-lg font-black text-[#134E4A]">
          {item.name}
        </h3>
        <p className="text-[11px] font-bold text-[#134E4A]/70 mt-0.5">
          {item.desc}
        </p>
      </div>

      <div
        className="relative my-4 flex h-40 w-full items-center justify-center rounded-xl border-[2px] border-[#134E4A] bg-[#F0FDF4] overflow-hidden shadow-[2px_2px_0px_#134E4A] cursor-pointer"
        onClick={() => onPreview(item)}
      >
        <div className="scale-95 transform">
          <TilaMascot
            size={110}
            skin={item.skinKey}
            mood={isEquipped ? "happy" : "idle"}
            direction="front"
            animation="none"
          />
        </div>
      </div>

      <div className="pt-2 border-t-2 border-dashed border-[#134E4A]/20 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#134E4A]/80">
          <SparklesSvg
            size={14}
            className="text-[#059669] dark:text-[#34D399] shrink-0"
          />
          <span>
            Efek:{" "}
            <span className="font-black text-[#134E4A]">{item.effect}</span>
          </span>
        </div>

        {isEquipped ? (
          <div className="w-full py-2.5 px-3 rounded-xl bg-[#134E4A] text-white text-xs font-black border-[2px] border-[#134E4A] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#134E4A]">
            <CheckSvg size={14} /> Dipakaikan
          </div>
        ) : isOwned ? (
          <StickerButton
            variant="primary"
            size="md"
            className="w-full"
            onClick={() => onBuy(item)}
          >
            Pakaikan
          </StickerButton>
        ) : (
          <StickerButton
            variant={affordable ? "primary" : "secondary"}
            size="md"
            pulse={affordable}
            className="w-full"
            disabled={!affordable}
            onClick={() => onBuy(item)}
          >
            <div className="flex items-center justify-center gap-1.5">
              {isTicket ? <TicketSvg size={16} /> : <CoinSvg size={16} />}
              <span>
                {isSuperAdmin || isUnlimited
                  ? "Gratis (VIP)"
                  : `${item.price} ${isTicket ? "Tiket" : "Koin"}`}
              </span>
            </div>
          </StickerButton>
        )}
      </div>
    </motion.div>
  );
});

export default function WarungSantriPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as ShopTab) || "energi";
  const VALID_TABS: ShopTab[] = [
    "energi",
    "skin",
    "kostum",
    "avatar",
    "kamar",
    "app",
    "booster",
  ];
  const [activeTab, setActiveTab] = useState<ShopTab>(
    VALID_TABS.includes(initialTab) ? initialTab : "energi",
  );

  const coins = useCoinsBalance();
  const { user, groupId } = useAuth();
  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s: any) => s.isVip);
  const isUnlimited = isUnlimitedUser(user as any, isVip, groupId as any);
  const grantEnergy = useEconomyStore((s) => s.grantEnergy);
  const purchasedToday = useEconomyStore((s) => s.purchasedToday);

  const ownedAccessories = useEconomyStore((s) => s.ownedAccessories);
  const equippedAccessory = useEconomyStore((s) => s.equippedAccessory);
  const buyAccessory = useEconomyStore((s) => s.buyAccessory);
  const equipAccessory = useEconomyStore((s) => s.equipAccessory);
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const [costumeFilter, setCostumeFilter] = useState<"all" | "boy" | "girl">(
    "all",
  );
  const [avatarGenderFilter, setAvatarGenderFilter] = useState<
    "all" | "boy" | "girl"
  >("all");

  const ownedAvatarAccessories = useEconomyStore(
    (s) => s.ownedAvatarAccessories || [],
  );
  const equippedAvatarAccessory = useEconomyStore(
    (s) => s.equippedAvatarAccessory,
  );
  const buyAvatarAccessory = useEconomyStore((s) => s.buyAvatarAccessory);
  const equipAvatarAccessory = useEconomyStore((s) => s.equipAvatarAccessory);

  const activeBoosters = useEconomyStore((s: any) => s.activeBoosters);
  const buyBooster = useEconomyStore((s: any) => s.buyBooster);

  const ownedRoomThemes = useEconomyStore((s) => s.ownedRoomThemes);
  const equippedRoomTheme = useEconomyStore((s) => s.equippedRoomTheme);
  const buyRoomTheme = useEconomyStore((s) => s.buyRoomTheme);
  const equipRoomTheme = useEconomyStore((s) => s.equipRoomTheme);

  const ownedAppThemes = useEconomyStore((s) => s.ownedAppThemes);
  const equippedAppTheme = useEconomyStore((s) => s.equippedAppTheme);
  const buyAppTheme = useEconomyStore((s) => s.buyAppTheme);
  const equipAppTheme = useEconomyStore((s) => s.equipAppTheme);

  const equippedSkin = useEconomyStore((s) => s.equippedSkin);
  const ownedSkins = useEconomyStore((s) => s.ownedSkins);
  const buySkin = useEconomyStore((s) => s.buySkin);
  const equipSkin = useEconomyStore((s) => s.equipSkin);
  const [skinRarityFilter, setSkinRarityFilter] = useState<"all" | SkinRarity>(
    "all",
  );
  const [previewSkin, setPreviewSkin] = useState<SkinItem | null>(null);

  const handlePreviewSkin = useCallback((item: SkinItem) => {
    setPreviewSkin(item);
  }, []);

  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotName = getMascotName(tilaGender);

  const [message, setMessage] = useState<string | null>(null);
  const [purchasedThemeModal, setPurchasedThemeModal] = useState<{
    item: ThemeItem;
    scope: "kamar" | "app";
  } | null>(null);

  const isSuperAdmin = isTartilaAdmin(user?.role);

  const stock: Record<EnergyKind, number> = { heart: hearts, ticket: tickets };

  const handleExchangeEnergy = async (item: (typeof ENERGY_ITEMS)[number]) => {
    const price = ENERGY_PRICES[item.kind];

    if (isUnlimited) {
      setMessage("Kamu memiliki energi tak terbatas (Superadmin/VIP)!");
      return;
    }
    if (purchasedToday(item.kind) >= SHOP_DAILY_LIMIT) {
      setMessage(`Batas ${SHOP_DAILY_LIMIT}x penukaran harian sudah tercapai.`);
      return;
    }
    if (stock[item.kind] >= item.max) {
      setMessage("Energimu sudah penuh, mainkan dulu ya.");
      return;
    }
    if (!isSuperAdmin && coins < price) {
      setMessage("Koin Hijaiyah-mu belum cukup.");
      return;
    }

    const ok = await grantEnergy(item.kind);
    setMessage(
      ok
        ? isSuperAdmin
          ? "GRATIS! Energi berhasil ditambahkan."
          : "Berhasil ditukar!"
        : "Gagal menukar energi. Coba lagi.",
    );
  };

  const handleBuyCostume = async (item: (typeof COSTUME_ITEMS)[number]) => {
    const activeGender = resolveMascotGender(tilaGender);
    const isFit = item.category === "all" || item.category === activeGender;

    if (ownedAccessories.includes(item.id)) {
      if (!isFit) {
        const targetGender = item.category === "boy" ? "boy" : "girl";
        setTilaGender(targetGender);
        equipAccessory(item.id);
        setMessage(
          `Beralih ke ${getMascotName(targetGender)} dan ${item.name} berhasil dipakai!`,
        );
        return;
      }
      equipAccessory(item.id);
      setMessage(`${item.name} berhasil dipakai!`);
      return;
    }

    if (!isSuperAdmin && coins < item.price) {
      setMessage("Koin Hijaiyah-mu belum cukup untuk kostum ini.");
      return;
    }

    const success = await buyAccessory(item.id, item.price);
    if (success) {
      if (!isFit) {
        const targetGender = item.category === "boy" ? "boy" : "girl";
        setTilaGender(targetGender);
        equipAccessory(item.id);
        setMessage(
          `Alhamdulillah! ${item.name} dibeli untuk ${getMascotName(targetGender)}!`,
        );
      } else {
        setMessage(
          `Alhamdulillah! ${item.name} berhasil dibeli dan langsung dipakai!`,
        );
      }
    } else {
      setMessage("Koin Hijaiyah-mu belum cukup.");
    }
  };

  const handleBuyBooster = async (item: (typeof BOOSTER_ITEMS)[number]) => {
    if (item.id === "full-heart" && hearts >= HEART_MAX) {
      setMessage("Hatimu sudah penuh maksimal!");
      return;
    }
    if (!isSuperAdmin && coins < item.price) {
      setMessage("Koin Hijaiyah-mu belum cukup untuk booster ini.");
      return;
    }
    const success = await buyBooster(item.id, item.price);
    if (success) {
      setMessage(
        isSuperAdmin
          ? `GRATIS! ${item.name} langsung aktif.`
          : `Alhamdulillah! ${item.name} berhasil diaktifkan!`,
      );
    } else {
      setMessage("Koin Hijaiyah-mu belum cukup.");
    }
  };

  const handleBuyAccessoryItem = async (
    item: (typeof ACCESSORY_ITEMS)[number],
  ): Promise<boolean> => {
    if (!isSuperAdmin && coins < item.price) {
      setMessage("Koin Hijaiyah-mu belum cukup untuk aksesoris ini.");
      return false;
    }
    const success = await buyAccessory(item.id, item.price);
    if (success) {
      setMessage(
        isSuperAdmin
          ? `GRATIS! ${item.name} terbuka dan dipakai!`
          : `Alhamdulillah! ${item.name} berhasil dibeli dan langsung dipakai!`,
      );
      return true;
    }
    setMessage("Koin Hijaiyah-mu belum cukup.");
    return false;
  };

  const handleToggleAccessoryItem = async (
    item: (typeof ACCESSORY_ITEMS)[number],
  ) => {
    const isOwned = ownedAccessories.includes(item.id);
    if (isOwned && equippedAccessory !== item.id) {
      equipAccessory(item.id);
      setMessage(`${item.name} berhasil dipakai!`);
      return;
    }
    if (equippedAccessory === item.id) return;
    await handleBuyAccessoryItem(item);
  };

  const handleToggleAvatarAccessory = async (item: AvatarAccessoryShopItem) => {
    const isOwned =
      item.id === "peci" || ownedAvatarAccessories.includes(item.id);

    if (isOwned) {
      if (equippedAvatarAccessory === item.id) {
        equipAvatarAccessory(null);
        tapFeedback();
        setMessage(`Aksesoris ${item.name} dilepas dari avatar.`);
        return;
      }
      equipAvatarAccessory(item.id);
      tapFeedback();
      playSfx("powerup");
      setMessage(`Aksesoris ${item.name} berhasil dipakai pada avatar profil!`);
      return;
    }

    if (item.price === 0 || isSuperAdmin) {
      const granted = await buyAvatarAccessory(item.id, 0);
      if (granted) {
        equipAvatarAccessory(item.id);
        tapFeedback();
        playSfx("powerup");
        setMessage(
          `Alhamdulillah! ${item.name} didapatkan gratis dan langsung dipakai!`,
        );
      } else {
        setMessage("Koin Hijaiyah-mu belum cukup.");
      }
      return;
    }

    if (coins < item.price) {
      playSfx("wrong");
      setMessage("Koin Hijaiyah-mu belum cukup untuk aksesoris ini.");
      return;
    }

    const success = await buyAvatarAccessory(item.id, item.price);
    if (success) {
      tapFeedback();
      playSfx("powerup");
      setMessage(
        `Alhamdulillah! ${item.name} berhasil dibeli dan dipakai pada avatar!`,
      );
    } else {
      setMessage("Koin Hijaiyah-mu belum cukup.");
    }
  };

  const handleToggleTheme = async (item: ThemeItem, scope: "kamar" | "app") => {
    const owned = scope === "kamar" ? ownedRoomThemes : ownedAppThemes;
    const equipped = scope === "kamar" ? equippedRoomTheme : equippedAppTheme;

    if (equipped === item.id) return;

    if (owned.includes(item.id)) {
      if (scope === "kamar") equipRoomTheme(item.id);
      else equipAppTheme(item.id);
      playSfx("correct");
      tapFeedback();
      setMessage(`Tema ${item.name} berhasil dipakaikan!`);
      return;
    }

    if (!isSuperAdmin && coins < item.price) {
      playSfx("wrong");
      setMessage("Koin Hijaiyah-mu belum cukup untuk tema ini.");
      return;
    }

    const success =
      scope === "kamar"
        ? await buyRoomTheme(item.id, item.price, false)
        : await buyAppTheme(item.id, item.price, false);

    if (success) {
      playSfx("powerup");
      tapFeedback();
      setPurchasedThemeModal({ item, scope });
    } else {
      playSfx("wrong");
      setMessage("Koin Hijaiyah-mu belum cukup.");
    }
  };

  const handleBuySkin = async (item: SkinItem) => {
    const isOwned =
      ownedSkins.includes(item.id) ||
      ownedSkins.includes(item.skinKey) ||
      item.id === "skin_default";

    if (isOwned) {
      equipSkin(item.id);
      setMessage(`Skin ${item.name} berhasil dipakaikan!`);
      return;
    }

    const isTicket = item.currency === "ticket";
    if (!isSuperAdmin && !isUnlimited) {
      if (isTicket) {
        if (tickets < item.price) {
          setMessage("Tiket Bermain-mu belum cukup untuk skin ini.");
          return;
        }
      } else {
        if (coins < item.price) {
          setMessage("Koin Hijaiyah-mu belum cukup untuk skin ini.");
          return;
        }
      }
    }

    const success = await buySkin(item.id, item.price, item.currency || "coin");
    if (success) {
      setMessage(
        isSuperAdmin
          ? `GRATIS! Skin ${item.name} berhasil dibuka dan dipakaikan!`
          : `Alhamdulillah! Skin ${item.name} berhasil dibuka dan dipakaikan!`,
      );
    } else {
      setMessage(
        isTicket
          ? "Tiket Bermain-mu belum cukup."
          : "Koin Hijaiyah-mu belum cukup.",
      );
    }
  };

  const handleBuyAndPreview = useCallback(
    (item: SkinItem) => {
      setPreviewSkin(null);
      void handleBuySkin(item);
    },
    [handleBuySkin],
  );

  return (
    <div className="min-h-screen bg-[var(--bg-app)] relative overflow-hidden flex flex-col transition-colors">
      <div className="sticky top-0 z-50 bg-[var(--bg-app)]/95 px-4 py-3 flex items-center justify-between border-b-[3px] border-[var(--border-color)] shadow-[0_2px_0px_var(--shadow-color)]">
        <button
          onClick={() => navigate("/member/ngaji-ceria")}
          className="w-10 h-10 flex items-center justify-center rounded-xl border-[3px] border-[var(--border-color)] bg-[var(--bg-card)] shadow-[2px_2px_0px_var(--shadow-color)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
        >
          <ChevronLeft size={20} className="text-[var(--text-main)]" />
        </button>
        <h1 className="font-display font-black text-[var(--text-main)] text-lg">
          Warung Santri
        </h1>
        <div className="w-10" />
      </div>

      <div className="px-4 py-4 pb-20 flex-1 overflow-y-auto flex flex-col">
        {isSuperAdmin && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border-[3px] border-[#F59E0B] bg-[#FEF08A] dark:bg-[#78350F]/50 p-4 shadow-[4px_4px_0px_var(--shadow-color)]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[var(--border-color)] bg-[var(--bg-card)] text-[#B45309] dark:text-[#FDE047]">
              <CrownSvg size={22} />
            </span>
            <div>
              <p className="text-sm font-black text-[var(--text-main)]">
                Mode Superadmin: Semua item gratis &amp; otomatis terbuka!
              </p>
              <p className="text-[10px] font-bold text-[var(--text-main)]/70">
                Ambil item tanpa memotong Koin Hati maupun Tiket.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center text-center pt-2 pb-2">
          <PetiHartaSvg size={80} className="mb-2 drop-shadow-md" />
          <h2 className="font-display text-2xl font-black text-[var(--text-main)]">
            Warung Santri
          </h2>
          <p className="text-xs font-bold text-[var(--text-main)]/60 mt-0.5 mb-4 max-w-[260px]">
            Tukar Koin Hijaiyah-mu dengan energi, busana {mascotName}, atau
            booster seru!
          </p>

          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[320px] mx-auto">
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[var(--border-color)] bg-[var(--bg-card)] py-2 shadow-[2px_2px_0px_var(--shadow-color)]">
              <CoinSvg size={20} />
              <span className="text-xs font-black text-[var(--text-main)]">
                {coins}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[var(--border-color)] bg-[var(--bg-card)] py-2 shadow-[2px_2px_0px_var(--shadow-color)]">
              <HeartSvg size={20} />
              <span className="text-xs font-black text-[var(--text-main)]">
                {isVip ? "∞" : `${hearts}/${HEART_MAX}`}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[var(--border-color)] bg-[var(--bg-card)] py-2 shadow-[2px_2px_0px_var(--shadow-color)]">
              <TicketSvg size={20} />
              <span className="text-xs font-black text-[var(--text-main)]">
                {isVip ? "∞" : `${tickets}/${TICKET_MAX}`}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 p-1.5 rounded-2xl bg-[var(--bg-card)] border-[3px] border-[var(--border-color)] shadow-[3px_3px_0px_var(--shadow-color)]">
          <div className="flex gap-2 overflow-x-auto pb-1 pt-1 px-1 scrollbar-thin [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TAB_ITEMS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearchParams({ tab: tab.key }, { replace: true });
                  }}
                  className={`shrink-0 whitespace-nowrap py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 border-[var(--border-color)] cursor-pointer ${
                    isActive
                      ? `${tab.activeColor} shadow-[2px_2px_0px_var(--shadow-color)] -translate-y-0.5`
                      : "bg-[var(--bg-card)] text-[var(--text-main)] shadow-none hover:opacity-80"
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {message && (
          <div
            role="status"
            className="mt-4 rounded-xl border-[2px] border-[var(--border-color)] bg-[var(--bg-card)] p-3 text-center text-xs font-black text-[var(--text-main)] shadow-[2px_2px_0px_var(--shadow-color)]"
          >
            {message}
          </div>
        )}

        {activeTab === "energi" && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2 rounded-xl border-[2px] border-[#0284C7] bg-[#E0F2FE] dark:bg-[#0369A1]/30 p-2.5 shadow-[2px_2px_0px_#0284C7]">
              <Info
                size={16}
                className="shrink-0 text-[#0284C7] dark:text-[#38BDF8]"
              />
              <p className="text-[10px] font-bold text-[#0284C7] dark:text-[#38BDF8]">
                Maksimal {SHOP_DAILY_LIMIT} penukaran per item energi setiap
                hari.
              </p>
            </div>

            <SectionHeader
              title="Tukar Energi"
              icon={<CoinSvg size={16} />}
              accent="teal"
            />

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3 pb-8"
            >
              {ENERGY_ITEMS.map((item) => {
                const price = ENERGY_PRICES[item.kind];
                const soldOut = isSuperAdmin
                  ? false
                  : purchasedToday(item.kind) >= SHOP_DAILY_LIMIT;
                const full = stock[item.kind] >= item.max;
                const affordable =
                  (isSuperAdmin || (coins >= price && !isVip)) &&
                  !soldOut &&
                  !full;

                return (
                  <motion.div key={item.kind} variants={staggerItemVariants}>
                    <StickerCard className="flex items-center gap-3 p-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)] ${
                          item.accent === "coral"
                            ? "bg-[#FFF0F0] dark:bg-[#7F1D1D]/30"
                            : "bg-[#FEF3C7] dark:bg-[#78350F]/30"
                        }`}
                      >
                        <item.icon
                          size={30}
                          className={
                            item.accent === "coral"
                              ? "text-[#FF6B6B]"
                              : "text-[#F59E0B]"
                          }
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-black text-[var(--text-main,#134E4A)]">
                          {item.name}
                        </h3>
                        <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/60">
                          {item.desc}
                        </p>
                        <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/60">
                          Sisa hari ini:{" "}
                          {SHOP_DAILY_LIMIT - purchasedToday(item.kind)}x (
                          {stock[item.kind]}/{item.max})
                        </p>
                      </div>
                      <StickerButton
                        variant={affordable ? "primary" : "secondary"}
                        size="sm"
                        pulse={affordable}
                        className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                        disabled={!affordable}
                        onClick={() => {
                          void handleExchangeEnergy(item);
                        }}
                      >
                        {isSuperAdmin ? (
                          <span className="text-[#0D9488]">GRATIS</span>
                        ) : (
                          <>
                            <CoinSvg size={14} /> {price}
                          </>
                        )}
                      </StickerButton>
                    </StickerCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {activeTab === "skin" && (
          <div className="space-y-4 mt-4 pb-8">
            <SectionHeader
              title={`Skin Eksklusif ${mascotName}`}
              icon={<SparklesSvg size={16} />}
              accent="teal"
            />

            <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] w-full overflow-x-auto scrollbar-none">
              {(
                [
                  { key: "all", label: `Semua (${SKIN_ITEMS.length})` },
                  { key: "Mythic", label: "Mythic (3)" },
                  { key: "Legendary", label: "Legendary (8)" },
                  { key: "Epic", label: "Epic (3)" },
                  { key: "Rare", label: "Rare (1)" },
                  { key: "Common", label: "Common (1)" },
                ] as const
              ).map((rf) => (
                <button
                  key={rf.key}
                  type="button"
                  onClick={() => setSkinRarityFilter(rf.key)}
                  className={`px-3 py-1 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                    skinRarityFilter === rf.key
                      ? "bg-[#FEF08A] text-[#134E4A] dark:bg-[#78350F] dark:text-[#FEF08A] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)] -translate-y-0.5"
                      : "text-[var(--text-main)]/70 hover:text-[var(--text-main)]"
                  }`}
                >
                  {rf.label}
                </button>
              ))}
            </div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {SKIN_ITEMS.filter((item) =>
                skinRarityFilter === "all"
                  ? true
                  : item.rarity === skinRarityFilter,
              ).map((item) => {
                const isOwned =
                  ownedSkins.includes(item.id) ||
                  ownedSkins.includes(item.skinKey) ||
                  item.id === "skin_default";
                const isEquipped = (equippedSkin || "default") === item.skinKey;
                const isTicket = item.currency === "ticket";
                const affordable =
                  isSuperAdmin ||
                  isUnlimited ||
                  (isTicket ? tickets >= item.price : coins >= item.price);

                return (
                  <SkinCard
                    key={item.id}
                    item={item}
                    isOwned={isOwned}
                    isEquipped={isEquipped}
                    isTicket={isTicket}
                    affordable={affordable}
                    isSuperAdmin={isSuperAdmin}
                    isUnlimited={isUnlimited}
                    onPreview={handlePreviewSkin}
                    onBuy={handleBuyAndPreview}
                  />
                );
              })}
            </motion.div>
          </div>
        )}

        {activeTab === "kostum" && (
          <div className="space-y-4 mt-4">
            <SectionHeader
              title={`Koleksi Busana ${mascotName}`}
              icon={<SparklesSvg size={16} />}
              accent="coral"
            />

            <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] w-fit">
              <button
                type="button"
                onClick={() => setCostumeFilter("all")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  costumeFilter === "all"
                    ? "bg-[#FEF08A] text-[#134E4A] dark:bg-[#78350F] dark:text-[#FEF08A] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]"
                    : "text-[var(--text-main)]/70 hover:text-[var(--text-main)]"
                }`}
              >
                Semua ({COSTUME_ITEMS.length})
              </button>
              <button
                type="button"
                onClick={() => setCostumeFilter("boy")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  costumeFilter === "boy"
                    ? "bg-[#CCFBF1] text-[#0F766E] dark:bg-[#064E3B] dark:text-[#5EEAD4] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]"
                    : "text-[var(--text-main)]/70 hover:text-[var(--text-main)]"
                }`}
              >
                Tito (Putra)
              </button>
              <button
                type="button"
                onClick={() => setCostumeFilter("girl")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  costumeFilter === "girl"
                    ? "bg-[#FCE7F3] text-[#BE185D] dark:bg-[#831843] dark:text-[#F472B6] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]"
                    : "text-[var(--text-main)]/70 hover:text-[var(--text-main)]"
                }`}
              >
                Tila (Putri)
              </button>
            </div>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3 pb-8"
            >
              {COSTUME_ITEMS.filter(
                (item) =>
                  costumeFilter === "all" ||
                  item.category === "all" ||
                  item.category === costumeFilter,
              ).map((item) => {
                const isOwned = ownedAccessories.includes(item.id);
                const isEquipped = equippedAccessory === item.id;
                const affordable = coins >= item.price;

                return (
                  <motion.div key={item.id} variants={staggerItemVariants}>
                    <StickerCard className="flex items-center gap-3.5 p-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--border-color)] bg-[#FEF3C7] dark:bg-[#78350F]/30 shadow-[2px_2px_0px_var(--shadow-color)]">
                        <item.iconComponent
                          size={26}
                          className={
                            item.accent === "coral"
                              ? "text-[#FB7185]"
                              : "text-[#0284C7]"
                          }
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-[var(--text-main)]">
                            {item.name}
                          </h3>
                          {item.category === "boy" ? (
                            <span className="text-[9px] font-extrabold bg-[#CCFBF1] dark:bg-[#064E3B]/60 text-[#0F766E] dark:text-[#5EEAD4] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                              Khusus Tito
                            </span>
                          ) : item.category === "girl" ? (
                            <span className="text-[9px] font-extrabold bg-[#FCE7F3] dark:bg-[#831843]/60 text-[#BE185D] dark:text-[#F472B6] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                              Khusus Tila
                            </span>
                          ) : (
                            <span className="text-[9px] font-extrabold bg-[#FEF08A] dark:bg-[#78350F]/60 text-[#134E4A] dark:text-[#FEF08A] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                              Semua Karakter
                            </span>
                          )}
                          {isEquipped && (
                            <span className="text-[9px] font-extrabold bg-[#134E4A] text-white px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                              Dipakaikan
                            </span>
                          )}
                          {isOwned && !isEquipped && (
                            <span className="text-[9px] font-extrabold bg-[#0D9488]/20 text-[#0D9488] dark:text-[#5EEAD4] px-2 py-0.5 rounded-md border border-[#0D9488]">
                              Dimiliki
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-[var(--text-main)]/60 mt-0.5">
                          {item.desc}
                        </p>
                      </div>

                      {isEquipped ? (
                        <span className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#134E4A] text-white text-xs font-black border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)]">
                          <CheckSvg size={12} /> Dipakaikan
                        </span>
                      ) : isOwned ? (
                        <StickerButton
                          variant="primary"
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleBuyCostume(item)}
                        >
                          Pakaikan
                        </StickerButton>
                      ) : (
                        <StickerButton
                          variant={
                            isSuperAdmin || affordable ? "primary" : "secondary"
                          }
                          size="sm"
                          pulse={affordable}
                          className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                          disabled={!isSuperAdmin && !affordable}
                          onClick={() => handleBuyCostume(item)}
                        >
                          {isSuperAdmin ? (
                            <span className="text-[#0D9488]">GRATIS</span>
                          ) : (
                            <>
                              <CoinSvg size={14} /> {item.price}
                            </>
                          )}
                        </StickerButton>
                      )}
                    </StickerCard>
                  </motion.div>
                );
              })}
            </motion.div>
            <SectionHeader
              title="Aksesoris Maskot"
              icon={<SparklesSvg size={16} />}
              accent="teal"
            />

            <div className="space-y-3 pb-8">
              {ACCESSORY_ITEMS.map((item) => {
                const isOwned = ownedAccessories.includes(item.id);
                const isEquipped = equippedAccessory === item.id;
                const highlight =
                  item.accent === "pink"
                    ? "bg-[#FCE7F3] dark:bg-[#831843]/30"
                    : item.accent === "purple"
                      ? "bg-[#EDE9FE] dark:bg-[#581C87]/30"
                      : item.accent === "cream"
                        ? "bg-[#FEFCE8] dark:bg-[#78350F]/30"
                        : item.accent === "sky"
                          ? "bg-[#E0F2FE] dark:bg-[#0369A1]/30"
                          : "bg-[#FEF3C7] dark:bg-[#78350F]/30";

                return (
                  <StickerCard
                    key={item.id}
                    className="flex items-center gap-3.5 p-4"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--border-color)] ${highlight} shadow-[2px_2px_0px_var(--shadow-color)]`}
                    >
                      <item.iconComponent
                        size={26}
                        className="text-[var(--text-main)]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black text-[var(--text-main)]">
                          {item.name}
                        </h3>
                        <span className="text-[9px] font-extrabold bg-[#FEF08A] dark:bg-[#78350F]/60 text-[#134E4A] dark:text-[#FEF08A] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                          Semua Karakter
                        </span>
                        {isEquipped && (
                          <span className="text-[9px] font-extrabold bg-[#134E4A] text-white px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                            Dipakaikan
                          </span>
                        )}
                        {isOwned && !isEquipped && (
                          <span className="text-[9px] font-extrabold bg-[#0D9488]/20 text-[#0D9488] dark:text-[#5EEAD4] px-2 py-0.5 rounded-md border border-[#0D9488]">
                            Dimiliki
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-[var(--text-main)]/60 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    {isEquipped ? (
                      <span className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#134E4A] text-white text-xs font-black border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)]">
                        <CheckSvg size={12} /> Dipakaikan
                      </span>
                    ) : (
                      <StickerButton
                        variant={
                          isOwned || isSuperAdmin || coins >= item.price
                            ? "primary"
                            : "secondary"
                        }
                        size="sm"
                        pulse={
                          !isOwned && (isSuperAdmin || coins >= item.price)
                        }
                        className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                        disabled={
                          !isOwned && !isSuperAdmin && coins < item.price
                        }
                        onClick={() => handleToggleAccessoryItem(item)}
                      >
                        {isOwned ? (
                          "Pakaikan"
                        ) : isSuperAdmin ? (
                          <span className="text-[#0D9488]">GRATIS</span>
                        ) : (
                          <>
                            <CoinSvg size={14} /> {item.price}
                          </>
                        )}
                      </StickerButton>
                    )}
                  </StickerCard>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "avatar" && (
          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between gap-2">
              <SectionHeader
                title="Aksesoris Avatar"
                icon={<GraduationCapSvg size={16} />}
                accent="teal"
              />
              {equippedAvatarAccessory && (
                <button
                  type="button"
                  onClick={() => {
                    equipAvatarAccessory(null);
                    tapFeedback();
                    setMessage("Aksesoris avatar dilepas.");
                  }}
                  className="shrink-0 text-xs font-black text-rose-600 dark:text-rose-400 hover:underline cursor-pointer px-2.5 py-1 bg-rose-50 dark:bg-rose-950/30 rounded-xl border-2 border-rose-200 dark:border-rose-800"
                >
                  Lepas Aksesoris
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-card)] rounded-2xl border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)] w-fit">
              <button
                type="button"
                onClick={() => setAvatarGenderFilter("all")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  avatarGenderFilter === "all"
                    ? "bg-[#FEF08A] text-[#134E4A] dark:bg-[#78350F] dark:text-[#FEF08A] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]"
                    : "text-[var(--text-main)]/70 hover:text-[var(--text-main)]"
                }`}
              >
                Semua ({AVATAR_ACCESSORY_SHOP_ITEMS.length})
              </button>
              <button
                type="button"
                onClick={() => setAvatarGenderFilter("boy")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  avatarGenderFilter === "boy"
                    ? "bg-[#CCFBF1] text-[#0F766E] dark:bg-[#064E3B] dark:text-[#5EEAD4] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]"
                    : "text-[var(--text-main)]/70 hover:text-[var(--text-main)]"
                }`}
              >
                Santri Putra
              </button>
              <button
                type="button"
                onClick={() => setAvatarGenderFilter("girl")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  avatarGenderFilter === "girl"
                    ? "bg-[#FCE7F3] text-[#BE185D] dark:bg-[#831843] dark:text-[#F472B6] border border-[var(--border-color)] shadow-[1px_1px_0px_var(--shadow-color)]"
                    : "text-[var(--text-main)]/70 hover:text-[var(--text-main)]"
                }`}
              >
                Santri Putri
              </button>
            </div>

            <p className="text-xs font-bold text-[var(--text-main)]/70">
              Kustomisasi penampilan avatar santri profilmu dengan aksesoris
              nusantara! Peci santri sudah tersedia gratis sebagai perlengkapan
              awal.
            </p>

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3 pb-8"
            >
              {AVATAR_ACCESSORY_SHOP_ITEMS.filter((item) =>
                avatarGenderFilter === "all"
                  ? true
                  : item.gender === "all" || item.gender === avatarGenderFilter,
              ).map((item) => {
                const isPeci = item.id === "peci";
                const isOwned =
                  isPeci || ownedAvatarAccessories.includes(item.id);
                const isEquipped = equippedAvatarAccessory === item.id;
                const affordable =
                  isSuperAdmin || isOwned || coins >= item.price;
                const avatarGender: "boy" | "girl" =
                  user?.gender === "female" || user?.gender === "perempuan"
                    ? "girl"
                    : "boy";

                return (
                  <motion.div key={item.id} variants={staggerItemVariants}>
                    <StickerCard className="flex items-center gap-3.5 p-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--border-color)] bg-[#FEF3C7] dark:bg-[#78350F]/30 shadow-[2px_2px_0px_var(--shadow-color)] overflow-hidden">
                        <AvatarSantriSvg
                          size={46}
                          gender={avatarGender}
                          accessory={item.id}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-black text-[var(--text-main)]">
                            {item.name}
                          </h3>
                          {isPeci && (
                            <span className="text-[9px] font-extrabold bg-[#CCFBF1] dark:bg-[#064E3B]/60 text-[#0F766E] dark:text-[#5EEAD4] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                              Gratis (Default)
                            </span>
                          )}
                          {isEquipped && (
                            <span className="text-[9px] font-extrabold bg-[#134E4A] text-white px-2 py-0.5 rounded-md border border-[var(--border-color)]">
                              Dipakaikan
                            </span>
                          )}
                          {isOwned && !isEquipped && (
                            <span className="text-[9px] font-extrabold bg-[#0D9488]/20 text-[#0D9488] dark:text-[#5EEAD4] px-2 py-0.5 rounded-md border border-[#0D9488]">
                              Dimiliki
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-[var(--text-main)]/60 mt-0.5">
                          {item.desc}
                        </p>
                      </div>

                      {isEquipped ? (
                        <span className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#134E4A] text-white text-xs font-black border-2 border-[var(--border-color)] shadow-[2px_2px_0px_var(--shadow-color)]">
                          <CheckSvg size={12} /> Dipakaikan
                        </span>
                      ) : isOwned ? (
                        <StickerButton
                          variant="primary"
                          size="sm"
                          className="shrink-0"
                          onClick={() => handleToggleAvatarAccessory(item)}
                        >
                          Pakaikan
                        </StickerButton>
                      ) : (
                        <StickerButton
                          variant={
                            isSuperAdmin || affordable ? "primary" : "secondary"
                          }
                          size="sm"
                          pulse={affordable}
                          className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                          disabled={!isSuperAdmin && !affordable}
                          onClick={() => handleToggleAvatarAccessory(item)}
                        >
                          {isSuperAdmin ? (
                            <span className="text-[#0D9488]">GRATIS</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <CoinSvg size={14} />
                              <span>
                                {item.price === 0 ? "Gratis" : item.price}
                              </span>
                            </div>
                          )}
                        </StickerButton>
                      )}
                    </StickerCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {activeTab === "kamar" && (
          <ThemeShopList
            items={ROOM_THEMES}
            coinsBalance={coins}
            ownedIds={ownedRoomThemes}
            equippedId={equippedRoomTheme}
            isSuperAdmin={isSuperAdmin}
            onToggle={(item) => handleToggleTheme(item, "kamar")}
          />
        )}

        {activeTab === "app" && (
          <ThemeShopList
            items={APP_THEMES}
            coinsBalance={coins}
            ownedIds={ownedAppThemes}
            equippedId={equippedAppTheme}
            isSuperAdmin={isSuperAdmin}
            onToggle={(item) => handleToggleTheme(item, "app")}
          />
        )}
        {activeTab === "booster" && (
          <div className="space-y-4 mt-4">
            <SectionHeader
              title="Booster Belajar"
              icon={<SparklesSvg size={16} />}
              accent="amber"
            />

            <motion.div
              variants={staggerContainerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3 pb-8"
            >
              {BOOSTER_ITEMS.map((item) => {
                const isActive =
                  (item.id === "double-exp" && activeBoosters.doubleExp) ||
                  (item.id === "streak-freeze" && activeBoosters.streakFreeze);
                const affordable = coins >= item.price;

                return (
                  <motion.div key={item.id} variants={staggerItemVariants}>
                    <StickerCard className="flex items-center gap-3.5 p-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] bg-[#FFF0F0] dark:bg-[#7F1D1D]/30 shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]">
                        <item.iconComponent
                          size={26}
                          className={
                            item.accent === "amber"
                              ? "text-[#F59E0B]"
                              : item.accent === "coral"
                                ? "text-[#FB7185]"
                                : "text-[#0284C7]"
                          }
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-[var(--text-main,#134E4A)]">
                            {item.name}
                          </h3>
                          {isActive && (
                            <span className="text-[9px] font-extrabold bg-[#0D9488] text-white px-2 py-0.5 rounded-md border border-[var(--border-color,#134E4A)]">
                              Aktif
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-[var(--text-main,#134E4A)]/60 mt-0.5">
                          {item.desc}
                        </p>
                      </div>

                      <StickerButton
                        variant={
                          isSuperAdmin || affordable ? "primary" : "secondary"
                        }
                        size="sm"
                        pulse={isSuperAdmin || affordable}
                        className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                        disabled={!isSuperAdmin && !affordable}
                        onClick={() => handleBuyBooster(item)}
                      >
                        {isSuperAdmin ? (
                          <span className="text-[#0D9488]">GRATIS</span>
                        ) : (
                          <>
                            <CoinSvg size={14} /> {item.price}
                          </>
                        )}
                      </StickerButton>
                    </StickerCard>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}
      </div>

      <AppModal
        isOpen={!!purchasedThemeModal}
        onClose={() => setPurchasedThemeModal(null)}
        title="Alhamdulillah!"
      >
        {purchasedThemeModal && (
          <div className="flex flex-col items-center">
            <div
              className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[var(--border-color,#134E4A)] shadow-[2px_2px_0px_var(--shadow-color,#134E4A)]"
              style={{ backgroundColor: purchasedThemeModal.item.swatch }}
            >
              <purchasedThemeModal.item.iconComponent
                size={32}
                className={purchasedThemeModal.item.iconColor}
              />
            </div>
            <p className="text-sm font-bold text-[var(--text-main,#134E4A)]/80 text-center">
              Tema <strong>{purchasedThemeModal.item.name}</strong> berhasil
              kamu dapatkan! Mau langsung memakainya sekarang?
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <StickerButton
                variant="primary"
                size="md"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  if (purchasedThemeModal.scope === "kamar") {
                    equipRoomTheme(purchasedThemeModal.item.id);
                  } else {
                    equipAppTheme(purchasedThemeModal.item.id);
                  }
                  playSfx("correct");
                  tapFeedback();
                  setMessage(
                    `Tema ${purchasedThemeModal.item.name} berhasil dipakaikan!`,
                  );
                  setPurchasedThemeModal(null);
                }}
              >
                <CheckSvg size={16} /> Pakai Sekarang
              </StickerButton>
              <button
                type="button"
                onClick={() => setPurchasedThemeModal(null)}
                className="w-full py-2 text-xs font-bold text-[var(--text-main,#134E4A)]/70 hover:text-[var(--text-main,#134E4A)] cursor-pointer"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        )}
      </AppModal>

      <AppModal
        isOpen={!!previewSkin}
        onClose={() => setPreviewSkin(null)}
        title="Pratinjau Skin"
        variant="warm"
      >
        {previewSkin && (
          <div className="flex flex-col items-center">
            <div className="relative mb-4 flex h-48 w-48 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] shadow-[6px_6px_0px_#134E4A] bg-[#F0FDF4]">
              <TilaMascot
                size={160}
                skin={previewSkin.skinKey}
                mood="happy"
                direction="front"
                animation="none"
              />
            </div>
            <div className="text-center">
              <h3 className="font-display text-xl font-black text-[#134E4A]">
                {previewSkin.name}
              </h3>
              <span
                className={`text-[10px] font-black uppercase px-3 py-1 rounded-md border-2 ${previewSkin.badgeBg}`}
              >
                {previewSkin.rarity || previewSkin.badgeText || "KLASIK"}
              </span>
              <p className="text-sm font-bold text-[#134E4A] mt-1">
                {previewSkin.desc}
              </p>
              <p className="text-xs font-bold text-[#0F766E] mt-1">
                Efek: {previewSkin.effect}
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                {previewSkin.previewColors.body && (
                  <div
                    className="h-4 w-4 rounded-full border border-[#134E4A]"
                    style={{ backgroundColor: previewSkin.previewColors.body }}
                  />
                )}
                {previewSkin.previewColors.accent && (
                  <div
                    className="h-4 w-4 rounded-full border border-[#134E4A]"
                    style={{
                      backgroundColor: previewSkin.previewColors.accent,
                    }}
                  />
                )}
                {previewSkin.previewColors.belly && (
                  <div
                    className="h-4 w-4 rounded-full border border-[#134E4A]"
                    style={{ backgroundColor: previewSkin.previewColors.belly }}
                  />
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <StickerButton
                variant="primary"
                size="md"
                className="flex-1"
                onClick={() => {
                  void handleBuySkin(previewSkin);
                  setPreviewSkin(null);
                }}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <CoinSvg size={16} />
                  {isSuperAdmin || isUnlimited
                    ? "Gratis (VIP)"
                    : `${previewSkin.price} ${previewSkin.currency === "ticket" ? "Tiket" : "Koin"}`}
                </div>
              </StickerButton>
              <StickerButton
                variant="secondary"
                size="md"
                className="flex-1"
                onClick={() => setPreviewSkin(null)}
              >
                Tutup
              </StickerButton>
            </div>
          </div>
        )}
      </AppModal>
    </div>
  );
}
