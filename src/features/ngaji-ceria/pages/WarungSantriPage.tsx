import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StickerButton, StickerCard, SectionHeader } from "@/components/ui";
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
import { PetiHartaSvg } from "@/components/ui/Illustrations";
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
import { normalizeRole } from "@/lib/roles";
import { shopApi } from "../services/ngajiCeriaApi";
import {
  getProgress,
  spendCoins,
  subscribeProgress,
} from "./games/_shared/progression";
import { getMascotName, resolveMascotGender } from "@/utils/mascotHelper";
import { TilaMascot } from "@/components/ui/TilaMascot";
import { SKIN_ITEMS, type SkinItem } from "../data/shopData";

function useCoinsBalance(): number {
  const [coins, setCoins] = useState(() => getProgress().coins);
  useEffect(() => subscribeProgress(() => setCoins(getProgress().coins)), []);
  return coins;
}

type ShopTab = "energi" | "skin" | "kostum" | "kamar" | "game" | "app" | "booster";

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
    key: "kamar",
    label: "Tema Kamar",
    icon: HomeSvg,
    activeColor: "bg-[#8B5CF6] text-white",
  },
  {
    key: "game",
    label: "Tema Game",
    icon: GamepadSvg,
    activeColor: "bg-[#0284C7] text-white",
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
  swatch: string; // warna pratinjau (lingkaran kecil)
}

const ROOM_THEMES: ThemeItem[] = [
  {
    id: "default",
    name: "Kamar Klasik",
    desc: "Kamar hangat khas Tartila: gratis untuk semua santri.",
    price: 0,
    iconComponent: HomeSvg,
    iconColor: "text-[#0D9488]",
    badgeBg: "bg-[#F0FDF4]",
    swatch: "#F0FDF4",
  },
  {
    id: "galaksi",
    name: "Galaksi Bima Sakti",
    desc: "Tidur di antara planet dan bintang-bintang berkilau.",
    price: 500,
    iconComponent: MoonSvg,
    iconColor: "text-[#6D28D9]",
    badgeBg: "bg-[#EDE9FE]",
    swatch: "#1E1B4B",
  },
  {
    id: "hutan",
    name: "Hutan Rimba",
    desc: "Suasana hijau hijauih dengan pohon dan rumput menjuntai.",
    price: 500,
    iconComponent: SparklesSvg,
    iconColor: "text-[#15803D]",
    badgeBg: "bg-[#DCFCE7]",
    swatch: "#166534",
  },
  {
    id: "istana",
    name: "Istana Pasir",
    desc: "Karpet merah dan kastil mini ala bangsawan.",
    price: 800,
    iconComponent: StarSvg,
    iconColor: "text-[#B45309]",
    badgeBg: "bg-[#FEF3C7]",
    swatch: "#E7C59E",
  },
];

const GAME_THEMES: ThemeItem[] = [
  {
    id: "default",
    name: "Tema Ceria",
    desc: "Warna klasik hijau Tosca khas semua game Tartila.",
    price: 0,
    iconComponent: GamepadSvg,
    iconColor: "text-[#0D9488]",
    badgeBg: "bg-[#F0FDF4]",
    swatch: "#0D9488",
  },
  {
    id: "neon",
    name: "Neon Cyberpunk",
    desc: "Arena gelap bergelektromagnetik dengan teks neon biru.",
    price: 300,
    iconComponent: ZapSvg,
    iconColor: "text-[#38BDF8]",
    badgeBg: "bg-[#111827]",
    swatch: "#38BDF8",
  },
  {
    id: "retro",
    name: "Retro Arcade",
    desc: "Nostalgia konsol lawas dengan latar krem dan garis tebal.",
    price: 300,
    iconComponent: StarSvg,
    iconColor: "text-[#B45309]",
    badgeBg: "bg-[#FFFBEB]",
    swatch: "#F59E0B",
  },
  {
    id: "pastel",
    name: "Pastel Ceria",
    desc: "Nuansa merah muda lembut yang manis dan menenangkan.",
    price: 400,
    iconComponent: SparklesSvg,
    iconColor: "text-[#EC4899]",
    badgeBg: "bg-[#FCE7F3]",
    swatch: "#F9A8D4",
  },
];

const APP_THEMES: ThemeItem[] = [
  {
    id: "default",
    name: "Hijau Zamrud",
    desc: "Tema orisinal Tartila yang segar, menyejukkan, dan ceria.",
    price: 0,
    iconComponent: SparklesSvg,
    iconColor: "text-[#0D9488]",
    badgeBg: "bg-[#DCFCE7]",
    swatch: "#0D9488",
  },
  {
    id: "sky",
    name: "Langit Biru",
    desc: "Nuansa biru samudra yang sejuk, lapang, dan menenangkan.",
    price: 250,
    iconComponent: SunSvg,
    iconColor: "text-[#0284C7]",
    badgeBg: "bg-[#E0F2FE]",
    swatch: "#0284C7",
  },
  {
    id: "rose",
    name: "Sakura Manis",
    desc: "Latar merah muda lembut yang hangat, ramah, dan memikat.",
    price: 250,
    iconComponent: HeartSvg,
    iconColor: "text-[#E11D48]",
    badgeBg: "bg-[#FFE4E6]",
    swatch: "#E11D48",
  },
  {
    id: "night",
    name: "Malam Khusyuk",
    desc: "Paduan slate modern dan indigo elegan untuk suasana fokus.",
    price: 300,
    iconComponent: MoonSvg,
    iconColor: "text-[#4F46E5]",
    badgeBg: "bg-[#E0E7FF]",
    swatch: "#4F46E5",
  },
  {
    id: "gold",
    name: "Kemilau Emas",
    desc: "Kemewahan emas bersahaja yang bercahaya dan bersemangat.",
    price: 300,
    iconComponent: StarSvg,
    iconColor: "text-[#CA8A04]",
    badgeBg: "bg-[#FEF9C3]",
    swatch: "#CA8A04",
  },
];

const ACCESSORY_ITEMS = [
  {
    id: "turban",
    name: "Serban Santri",
    desc: "Serban putih melilit kepala, cocok untuk semua karakter.",
    iconComponent: TurbanSvg,
    price: 150,
    accent: "cream",
  },
  {
    id: "wizardhat",
    name: "Topi Penyihir",
    desc: "Topi kerucut ungu berhias bintang emas sangar.",
    iconComponent: WizardHatSvg,
    price: 250,
    accent: "purple",
  },
  {
    id: "headphone",
    name: "Headphone DJ",
    desc: "Headphone merah muda untuk ngajinya tala comedian.",
    iconComponent: HeadphoneSvg,
    price: 300,
    accent: "pink",
  },
  {
    id: "sleepmask",
    name: "Sleep Mask",
    desc: "Penutup mata biru pola zzz untuk istirahat Tito.",
    iconComponent: SleepMaskSvg,
    price: 100,
    accent: "sky",
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
    name: "1 Hati Belajar",
    desc: "Untuk masuk sesi belajar Tilawati.",
    icon: HeartSvg,
    accent: "coral",
    max: HEART_MAX,
  },
  {
    kind: "ticket",
    name: "1 Tiket Bermain",
    desc: "Untuk masuk ke Mini Games.",
    icon: TicketSvg,
    accent: "amber",
    max: TICKET_MAX,
  },
];

const COSTUME_ITEMS = [
  {
    id: "peci",
    name: "Peci Santri",
    desc: "Songkok hitam berhias sulam emas khas santri cilik.",
    iconComponent: GraduationCapSvg,
    price: 200,
    accent: "teal",
    category: "boy" as const,
  },
  {
    id: "hairbow",
    name: "Pita Rambut",
    desc: "Pita cantik berwarna merah muda yang manis dan anggun.",
    iconComponent: HairbowSvg,
    price: 200,
    accent: "coral",
    category: "girl" as const,
  },
  {
    id: "flowercrown",
    name: "Mahkota Bunga",
    desc: "Karangan bunga aneka warna yang segar, ceria, dan mempesona.",
    iconComponent: CrownSvg,
    price: 300,
    accent: "amber",
    category: "girl" as const,
  },
  {
    id: "glasses",
    name: "Kacamata Pintar",
    desc: "Kacamata bulat stylish pembawa semangat belajar tekun.",
    iconComponent: GlassesSvg,
    price: 500,
    accent: "sky",
    category: "all" as const,
  },
  {
    id: "crown",
    name: "Mahkota Juara",
    desc: "Mahkota emas gemerlap tanda santri istiqomah.",
    iconComponent: CrownSvg,
    price: 1000,
    accent: "amber",
    category: "all" as const,
  },
];

const BOOSTER_ITEMS = [
  {
    id: "double-exp",
    name: "Double EXP (2x)",
    desc: "Dapatkan 2x lipat EXP untuk setiap kuis yang kamu selesaikan.",
    iconComponent: ZapSvg,
    price: 100,
    accent: "amber",
  },
  {
    id: "full-heart",
    name: "Full Hati Instan",
    desc: "Isi ulang seluruh 5 Hati belajar seketika tanpa menunggu.",
    iconComponent: HeartSvg,
    price: 300,
    accent: "coral",
  },
  {
    id: "streak-freeze",
    name: "Streak Freeze",
    desc: "Lindungi streak istiqomahmu agar tidak putus jika terlewat 1 hari.",
    iconComponent: SnowflakeSvg,
    price: 150,
    accent: "sky",
  },
];

/** Daftar item tema (Kamar / Téma Game): menyerupai UI Tab Kostum */
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
      <div className="space-y-3">
        {items.map((item) => {
          const isOwned = ownedIds.includes(item.id) || item.id === "default";
          const isEquipped = equippedId === item.id;
          const Icon = item.iconComponent;
          const affordable = isSuperAdmin || coinsBalance >= item.price;

          return (
            <StickerCard
              key={item.id}
              className="flex items-center gap-3.5 p-4"
            >
              {/* Pratinjau warna + ikon */}
              <div
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] overflow-hidden"
                style={{ backgroundColor: item.swatch }}
              >
                <Icon size={26} className={item.iconColor} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-black text-[#134E4A]">
                    {item.name}
                  </h3>
                  {item.price === 0 ? (
                    <span className="text-[9px] font-extrabold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded-md border border-[#134E4A]">
                      Gratis
                    </span>
                  ) : null}
                  {isEquipped && (
                    <span className="text-[9px] font-extrabold bg-[#134E4A] text-white px-2 py-0.5 rounded-md border border-[#134E4A]">
                      Dipakaikan
                    </span>
                  )}
                  {isOwned && !isEquipped && (
                    <span className="text-[9px] font-extrabold bg-[#0D9488]/20 text-[#0D9488] px-2 py-0.5 rounded-md border border-[#0D9488]">
                      Dimiliki
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-[#134E4A]/60 mt-0.5">
                  {item.desc}
                </p>
              </div>

              {isEquipped ? (
                <span className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#134E4A] text-white text-xs font-black border-2 border-[#134E4A]">
                  <CheckSvg size={12} /> Aktif
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
                  className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                  disabled={!affordable}
                  onClick={() => onToggle(item)}
                >
                  {isSuperAdmin ? (
                    <span className="text-[#0D9488]">GRATIS · Ambil</span>
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
  );
}

export default function WarungSantriPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as ShopTab) || "energi";
  const VALID_TABS: ShopTab[] = [
    "energi",
    "skin",
    "kostum",
    "kamar",
    "game",
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

  const activeBoosters = useEconomyStore((s: any) => s.activeBoosters);
  const buyBooster = useEconomyStore((s: any) => s.buyBooster);

  // Kustomisasi Kamar & Tema Game
  const ownedRoomThemes = useEconomyStore((s) => s.ownedRoomThemes);
  const equippedRoomTheme = useEconomyStore((s) => s.equippedRoomTheme);
  const buyRoomTheme = useEconomyStore((s) => s.buyRoomTheme);
  const equipRoomTheme = useEconomyStore((s) => s.equipRoomTheme);
  const ownedGameThemes = useEconomyStore((s) => s.ownedGameThemes);
  const equippedGameTheme = useEconomyStore((s) => s.equippedGameTheme);
  const buyGameTheme = useEconomyStore((s) => s.buyGameTheme);
  const equipGameTheme = useEconomyStore((s) => s.equipGameTheme);

  // Kustomisasi Tema Aplikasi
  const ownedAppThemes = useEconomyStore((s) => s.ownedAppThemes);
  const equippedAppTheme = useEconomyStore((s) => s.equippedAppTheme);
  const buyAppTheme = useEconomyStore((s) => s.buyAppTheme);
  const equipAppTheme = useEconomyStore((s) => s.equipAppTheme);

  // Kustomisasi Skin Maskot (Naga & Robot)
  const equippedSkin = useEconomyStore((s) => s.equippedSkin);
  const ownedSkins = useEconomyStore((s) => s.ownedSkins);
  const buySkin = useEconomyStore((s) => s.buySkin);
  const equipSkin = useEconomyStore((s) => s.equipSkin);

  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotName = getMascotName(tilaGender);

  const [message, setMessage] = useState<string | null>(null);
  const [purchasedThemeModal, setPurchasedThemeModal] = useState<{
    item: ThemeItem;
    scope: "kamar" | "game" | "app";
  } | null>(null);

  // Privilege Superadmin/Admin: semua item Warung gratis (backend bypass koin).
  const isSuperAdmin =
    normalizeRole(user?.role) === "admin" ||
    normalizeRole(user?.role) === "superadmin";

  // Optimistic unlock + catat ke backend (gratis untuk privileged role).
  const unlockItem = (
    kind: "accessory" | "room_theme" | "game_theme" | "app_theme" | "booster" | "skin",
    itemId: string,
    price: number,
  ) => {
    shopApi
      .buyItem(kind as any, itemId, price)
      .catch(() =>
        setMessage(
          "Item terbuka lokal; backend sedang tidak terjangkau, sinkron nanti.",
        ),
      );
  };

  const stock: Record<EnergyKind, number> = { heart: hearts, ticket: tickets };

  const handleExchangeEnergy = (item: (typeof ENERGY_ITEMS)[number]) => {
    const price = ENERGY_PRICES[item.kind];

    if (isUnlimited) {
      setMessage("Kamu memiliki energi tak terbatas (Superadmin/VIP)!");
      return;
    }
    if (!isSuperAdmin) {
      if (purchasedToday(item.kind) >= SHOP_DAILY_LIMIT) {
        setMessage(
          `Batas ${SHOP_DAILY_LIMIT}x penukaran harian sudah tercapai.`,
        );
        return;
      }
      if (!spendCoins(price)) {
        setMessage("Koin Hijaiyah-mu belum cukup.");
        return;
      }
    }
    if (stock[item.kind] >= item.max) {
      setMessage("Energimu sudah penuh, mainkan dulu ya.");
      return;
    }
    grantEnergy(item.kind);
    setMessage(
      isSuperAdmin
        ? "GRATIS! Energi berhasil ditambahkan."
        : "Berhasil ditukar!",
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

    const success = await buyAccessory(item.id, item.price, isSuperAdmin);
    if (success) {
      unlockItem("accessory", item.id, item.price);
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
    const success = await buyBooster(item.id, item.price, isSuperAdmin);
    if (success) {
      unlockItem("booster", item.id, item.price);
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
    const success = await buyAccessory(item.id, item.price, isSuperAdmin);
    if (success) {
      unlockItem("accessory", item.id, item.price);
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

  const handleToggleTheme = (
    item: ThemeItem,
    scope: "kamar" | "game" | "app",
  ) => {
    const owned =
      scope === "kamar"
        ? ownedRoomThemes
        : scope === "game"
          ? ownedGameThemes
          : ownedAppThemes;
    const equipped =
      scope === "kamar"
        ? equippedRoomTheme
        : scope === "game"
          ? equippedGameTheme
          : equippedAppTheme;

    if (equipped === item.id) return;

    if (owned.includes(item.id)) {
      if (scope === "kamar") equipRoomTheme(item.id);
      else if (scope === "game") equipGameTheme(item.id);
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
        ? buyRoomTheme(item.id, item.price, isSuperAdmin, false)
        : scope === "game"
          ? buyGameTheme(item.id, item.price, isSuperAdmin, false)
          : buyAppTheme(item.id, item.price, isSuperAdmin, false);

    if (success) {
      unlockItem(
        scope === "kamar"
          ? "room_theme"
          : scope === "game"
            ? "game_theme"
            : "app_theme",
        item.id,
        item.price,
      );
      playSfx("powerup");
      tapFeedback();
      setPurchasedThemeModal({ item, scope });
    } else {
      playSfx("wrong");
      setMessage("Koin Hijaiyah-mu belum cukup.");
    }
  };

  const handleBuySkin = (item: SkinItem) => {
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

    const success = buySkin(item.id, item.price, item.currency || "coin");
    if (success) {
      unlockItem("skin", item.id, item.price);
      setMessage(
        isSuperAdmin
          ? `GRATIS! Skin ${item.name} berhasil dibuka dan dipakaikan!`
          : `Alhamdulillah! Skin ${item.name} berhasil dibuka dan dipakaikan!`,
      );
    } else {
      setMessage(
        isTicket ? "Tiket Bermain-mu belum cukup." : "Koin Hijaiyah-mu belum cukup.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] relative overflow-hidden flex flex-col">
      {/* HEADER MANUAL (STICKER NEO-BRUTALISM) */}
      <div className="sticky top-0 z-50 bg-[#F0FDF4]/95 px-4 py-3 flex items-center justify-between border-b-[3px] border-[#134E4A] shadow-[0_2px_0px_#134E4A]">
        <button
          onClick={() => navigate("/member/ngaji-ceria")}
          className="w-10 h-10 flex items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <ChevronLeft size={20} className="text-[#134E4A]" />
        </button>
        <h1 className="font-display font-black text-[#134E4A] text-lg">
          Warung Santri
        </h1>
        <div className="w-10" />
      </div>

      {/* KONTEN SCROLLABLE */}
      <div className="px-4 py-4 pb-20 flex-1 overflow-y-auto flex flex-col">
        {/* BANNER PRIVILEGE SUPERADMIN */}
        {isSuperAdmin && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl border-[3px] border-[#F59E0B] bg-[#FEF08A] p-4 shadow-[4px_4px_0px_#134E4A]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#134E4A] bg-white text-[#B45309]">
              <CrownSvg size={22} />
            </span>
            <div>
              <p className="text-sm font-black text-[#134E4A]">
                Mode Superadmin: Semua item gratis &amp; otomatis terbuka!
              </p>
              <p className="text-[10px] font-bold text-[#134E4A]/70">
                Ambil item tanpa memotong Koin Hati maupun Tiket.
              </p>
            </div>
          </div>
        )}

        {/* HEADER MASKOT & STATUS */}
        <div className="flex flex-col items-center justify-center text-center pt-2 pb-2">
          <PetiHartaSvg size={80} className="mb-2 drop-shadow-md" />
          <h2 className="font-display text-2xl font-black text-[#134E4A]">
            Warung Santri
          </h2>
          <p className="text-xs font-bold text-[#134E4A]/60 mt-0.5 mb-4 max-w-[260px]">
            Tukar Koin Hijaiyah-mu dengan energi, busana {mascotName}, atau
            booster seru!
          </p>

          {/* PANEL STATUS (Koin, Hati, Tiket) */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[320px] mx-auto">
            {/* Koin */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[#134E4A] bg-[#FEF3C7] py-2 shadow-[2px_2px_0px_#134E4A]">
              <CoinSvg size={20} />
              <span className="text-xs font-black text-[#134E4A]">{coins}</span>
            </div>

            {/* Hati */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[#134E4A] bg-[#FFF0F0] py-2 shadow-[2px_2px_0px_#134E4A]">
              <HeartSvg size={20} />
              <span className="text-xs font-black text-[#134E4A]">
                {isVip ? "∞" : `${hearts}/${HEART_MAX}`}
              </span>
            </div>

            {/* Tiket */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[#134E4A] bg-[#F0FDF4] py-2 shadow-[2px_2px_0px_#134E4A]">
              <TicketSvg size={20} />
              <span className="text-xs font-black text-[#134E4A]">
                {isVip ? "∞" : `${tickets}/${TICKET_MAX}`}
              </span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION: SCROLLABLE HORIZONTAL (STICKER STYLE) */}
        <div className="mt-5 p-1.5 rounded-2xl bg-white border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]">
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
                  className={`shrink-0 whitespace-nowrap py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 border-2 border-[#134E4A] ${
                    isActive
                      ? `${tab.activeColor} shadow-[2px_2px_0px_#134E4A] -translate-y-0.5`
                      : "bg-white text-[#134E4A] shadow-none hover:bg-gray-50"
                  }`}
                >
                  <TabIcon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* NOTIFIKASI */}
        {message && (
          <div
            role="status"
            className="mt-4 rounded-xl border-[2px] border-[#134E4A] bg-[#FEF3C7] p-3 text-center text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
          >
            {message}
          </div>
        )}

        {/* TAB 1: ENERGI */}
        {activeTab === "energi" && (
          <div className="space-y-4 mt-4">
            {/* INFO BATAS HARIAN - HANYA UNTUK ENERGI */}
            <div className="flex items-center gap-2 rounded-xl border-[2px] border-[#0284C7] bg-[#E0F2FE] p-2.5 shadow-[2px_2px_0px_#0284C7]">
              <Info size={16} className="shrink-0 text-[#0284C7]" />
              <p className="text-[10px] font-bold text-[#0284C7]">
                Maksimal {SHOP_DAILY_LIMIT} penukaran per item energi setiap
                hari.
              </p>
            </div>

            <SectionHeader
              title="Tukar Energi"
              icon={<CoinSvg size={16} />}
              accent="teal"
            />

            <div className="space-y-3 pb-8">
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
                  <StickerCard
                    key={item.kind}
                    className="flex items-center gap-3 p-4"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] ${
                        item.accent === "coral"
                          ? "bg-[#FFF0F0]"
                          : "bg-[#FEF3C7]"
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
                      <h3 className="text-sm font-black text-[#134E4A]">
                        {item.name}
                      </h3>
                      <p className="text-[10px] font-bold text-[#134E4A]/60">
                        {item.desc}
                      </p>
                      <p className="text-[10px] font-bold text-[#134E4A]/60">
                        Sisa hari ini:{" "}
                        {SHOP_DAILY_LIMIT - purchasedToday(item.kind)}x (
                        {stock[item.kind]}/{item.max})
                      </p>
                    </div>
                    <StickerButton
                      variant={affordable ? "primary" : "secondary"}
                      size="sm"
                      className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                      disabled={!affordable}
                      onClick={() => handleExchangeEnergy(item)}
                    >
                      {isSuperAdmin ? (
                        <span className="text-[#0D9488]">GRATIS · Ambil</span>
                      ) : (
                        <>
                          <CoinSvg size={14} /> {price}
                        </>
                      )}
                    </StickerButton>
                  </StickerCard>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: SKIN MASKOT (NAGA & ROBOT) */}
        {activeTab === "skin" && (
          <div className="space-y-4 mt-4 pb-8">
            <SectionHeader
              title={`Skin Eksklusif ${mascotName}`}
              icon={<SparklesSvg size={16} />}
              accent="teal"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SKIN_ITEMS.map((item) => {
                const isOwned =
                  ownedSkins.includes(item.id) ||
                  ownedSkins.includes(item.skinKey) ||
                  item.id === "skin_default";
                const isEquipped =
                  (equippedSkin || "default") === item.skinKey;
                const isTicket = item.currency === "ticket";
                const affordable =
                  isSuperAdmin ||
                  isUnlimited ||
                  (isTicket ? tickets >= item.price : coins >= item.price);

                const isMythic = item.rarity === "Mythic";
                const isLegendary = item.rarity === "Legendary";

                const badgeBgColor = isMythic
                  ? "bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 text-amber-900 border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] font-black"
                  : isLegendary
                    ? "bg-[#FEF3C7] text-[#B45309] border-[#F59E0B]"
                    : item.skinKey === "naga"
                      ? "bg-[#D1FAE5] text-[#065F46] border-[#059669]"
                      : item.skinKey === "robot"
                        ? "bg-[#CFFAFE] text-[#155E75] border-[#0891B2]"
                        : "bg-[#FEF3C7] text-[#92400E] border-[#D97706]";

                const cardBorderClass = isMythic
                  ? "border-[3px] border-[#B45309] bg-gradient-to-b from-[#FFFDF5] to-white shadow-[4px_4px_0px_#B45309] ring-2 ring-amber-400/40 hover:shadow-[6px_6px_0px_#B45309]"
                  : "border-[3px] border-[#134E4A] bg-white shadow-[4px_4px_0px_#134E4A] hover:shadow-[6px_6px_0px_#134E4A]";

                return (
                  <div
                    key={item.id}
                    className={`relative flex flex-col justify-between rounded-2xl p-4 transition-all hover:translate-y-[-2px] ${cardBorderClass}`}
                  >
                    {/* Header Card: Name & Badges */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border-2 ${badgeBgColor}`}
                        >
                          {item.rarity || item.badgeText || "KLASIK"}
                        </span>
                        {isEquipped ? (
                          <span className="text-[10px] font-black bg-[#134E4A] text-white px-2.5 py-0.5 rounded-md border-2 border-[#134E4A] flex items-center gap-1 shadow-[1px_1px_0px_#134E4A]">
                            <CheckSvg size={12} /> Dipakai
                          </span>
                        ) : isOwned ? (
                          <span className="text-[10px] font-black bg-[#CCFBF1] text-[#0F766E] px-2.5 py-0.5 rounded-md border-2 border-[#0F766E]">
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

                    {/* Mascot Interactive Preview */}
                    <div className="relative my-4 flex h-40 w-full items-center justify-center rounded-xl border-[2px] border-[#134E4A] bg-[#F0FDF4] overflow-hidden shadow-[2px_2px_0px_#134E4A]">
                      <div className="scale-95 transform">
                        <TilaMascot
                          size={110}
                          skin={item.skinKey}
                          mood={isEquipped ? "happy" : "idle"}
                          direction="front"
                        />
                      </div>
                    </div>

                    {/* Footer: Effect & Action Button */}
                    <div className="pt-2 border-t-2 border-dashed border-[#134E4A]/20 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#134E4A]/80">
                        <SparklesSvg size={14} className="text-[#059669] shrink-0" />
                        <span>
                          Efek: <span className="font-black text-[#134E4A]">{item.effect}</span>
                        </span>
                      </div>

                      {isEquipped ? (
                        <div className="w-full py-2.5 px-3 rounded-xl bg-[#134E4A] text-white text-xs font-black border-[2px] border-[#134E4A] flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#134E4A]">
                          <CheckSvg size={14} /> Sedang Dipakai
                        </div>
                      ) : isOwned ? (
                        <StickerButton
                          variant="primary"
                          size="md"
                          className="w-full"
                          onClick={() => handleBuySkin(item)}
                        >
                          Pakaikan
                        </StickerButton>
                      ) : (
                        <StickerButton
                          variant={affordable ? "primary" : "secondary"}
                          size="md"
                          className="w-full"
                          disabled={!affordable}
                          onClick={() => handleBuySkin(item)}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            {isTicket ? (
                              <TicketSvg size={16} />
                            ) : (
                              <CoinSvg size={16} />
                            )}
                            <span>
                              {isSuperAdmin || isUnlimited
                                ? "Buka Gratis (VIP)"
                                : `${item.price} ${isTicket ? "Tiket" : "Koin"}`}
                            </span>
                          </div>
                        </StickerButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: KOSTUM MASKOT */}
        {activeTab === "kostum" && (
          <div className="space-y-4 mt-4">
            <SectionHeader
              title={`Koleksi Busana ${mascotName}`}
              icon={<SparklesSvg size={16} />}
              accent="coral"
            />

            {/* Filter Pill Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] w-fit">
              <button
                type="button"
                onClick={() => setCostumeFilter("all")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  costumeFilter === "all"
                    ? "bg-[#FEF08A] text-[#134E4A] border border-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
                    : "text-gray-600 hover:text-[#134E4A]"
                }`}
              >
                Semua ({COSTUME_ITEMS.length})
              </button>
              <button
                type="button"
                onClick={() => setCostumeFilter("boy")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  costumeFilter === "boy"
                    ? "bg-[#CCFBF1] text-[#0F766E] border border-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
                    : "text-gray-600 hover:text-[#134E4A]"
                }`}
              >
                Tito (Putra)
              </button>
              <button
                type="button"
                onClick={() => setCostumeFilter("girl")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  costumeFilter === "girl"
                    ? "bg-[#FCE7F3] text-[#BE185D] border border-[#134E4A] shadow-[1px_1px_0px_#134E4A]"
                    : "text-gray-600 hover:text-[#134E4A]"
                }`}
              >
                Tila (Putri)
              </button>
            </div>

            <div className="space-y-3 pb-8">
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
                  <StickerCard
                    key={item.id}
                    className="flex items-center gap-3.5 p-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FEF3C7] shadow-[2px_2px_0px_#134E4A]">
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
                        <h3 className="text-sm font-black text-[#134E4A]">
                          {item.name}
                        </h3>
                        {item.category === "boy" ? (
                          <span className="text-[9px] font-extrabold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded-md border border-[#134E4A]">
                            Khusus Tito (Putra)
                          </span>
                        ) : item.category === "girl" ? (
                          <span className="text-[9px] font-extrabold bg-[#FCE7F3] text-[#BE185D] px-2 py-0.5 rounded-md border border-[#134E4A]">
                            Khusus Tila (Putri)
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold bg-[#FEF08A] text-[#134E4A] px-2 py-0.5 rounded-md border border-[#134E4A]">
                            Semua Karakter
                          </span>
                        )}
                        {isEquipped && (
                          <span className="text-[9px] font-extrabold bg-[#134E4A] text-white px-2 py-0.5 rounded-md border border-[#134E4A]">
                            Dipakai
                          </span>
                        )}
                        {isOwned && !isEquipped && (
                          <span className="text-[9px] font-extrabold bg-[#0D9488]/20 text-[#0D9488] px-2 py-0.5 rounded-md border border-[#0D9488]">
                            Dimiliki
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-[#134E4A]/60 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    {isEquipped ? (
                      <span className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#134E4A] text-white text-xs font-black border-2 border-[#134E4A]">
                        <CheckSvg size={12} /> Aktif
                      </span>
                    ) : isOwned ? (
                      <StickerButton
                        variant="primary"
                        size="sm"
                        className="shrink-0"
                        onClick={() => handleBuyCostume(item)}
                      >
                        Pakai
                      </StickerButton>
                    ) : (
                      <StickerButton
                        variant={
                          isSuperAdmin || affordable ? "primary" : "secondary"
                        }
                        size="sm"
                        className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                        disabled={!isSuperAdmin && !affordable}
                        onClick={() => handleBuyCostume(item)}
                      >
                        {isSuperAdmin ? (
                          <span className="text-[#0D9488]">
                            GRATIS · Ambil
                          </span>
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
            {/* Aksesoris Maskot Tambahan */}
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
                    ? "bg-[#FCE7F3]"
                    : item.accent === "purple"
                      ? "bg-[#EDE9FE]"
                      : item.accent === "cream"
                        ? "bg-[#FEFCE8]"
                        : item.accent === "sky"
                          ? "bg-[#E0F2FE]"
                          : "bg-[#FEF3C7]";

                return (
                  <StickerCard
                    key={item.id}
                    className="flex items-center gap-3.5 p-4"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] ${highlight} shadow-[2px_2px_0px_#134E4A]`}
                    >
                      <item.iconComponent
                        size={26}
                        className="text-[#134E4A]"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black text-[#134E4A]">
                          {item.name}
                        </h3>
                        <span className="text-[9px] font-extrabold bg-[#FEF08A] text-[#134E4A] px-2 py-0.5 rounded-md border border-[#134E4A]">
                          Semua Karakter
                        </span>
                        {isEquipped && (
                          <span className="text-[9px] font-extrabold bg-[#134E4A] text-white px-2 py-0.5 rounded-md border border-[#134E4A]">
                            Dipakai
                          </span>
                        )}
                        {isOwned && !isEquipped && (
                          <span className="text-[9px] font-extrabold bg-[#0D9488]/20 text-[#0D9488] px-2 py-0.5 rounded-md border border-[#0D9488]">
                            Dimiliki
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-[#134E4A]/60 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    {isEquipped ? (
                      <span className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#134E4A] text-white text-xs font-black border-2 border-[#134E4A]">
                        <CheckSvg size={12} /> Aktif
                      </span>
                    ) : (
                      <StickerButton
                        variant={
                          isOwned || isSuperAdmin || coins >= item.price
                            ? "primary"
                            : "secondary"
                        }
                        size="sm"
                        className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                        disabled={!isOwned && !isSuperAdmin && coins < item.price}
                        onClick={() => handleToggleAccessoryItem(item)}
                      >
                        {isOwned ? (
                          "Pakai"
                        ) : isSuperAdmin ? (
                          <span className="text-[#0D9488]">
                            GRATIS · Ambil
                          </span>
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

        {/* TAB: KUSTOMISASI KAMAR */}
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

        {/* TAB: KUSTOMISASI TEMA GAME */}
        {activeTab === "game" && (
          <ThemeShopList
            items={GAME_THEMES}
            coinsBalance={coins}
            ownedIds={ownedGameThemes}
            equippedId={equippedGameTheme}
            isSuperAdmin={isSuperAdmin}
            onToggle={(item) => handleToggleTheme(item, "game")}
          />
        )}

        {/* TAB: KUSTOMISASI TEMA APLIKASI */}
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

            <div className="space-y-3 pb-8">
              {BOOSTER_ITEMS.map((item) => {
                const isActive =
                  (item.id === "double-exp" && activeBoosters.doubleExp) ||
                  (item.id === "streak-freeze" && activeBoosters.streakFreeze);
                const affordable = coins >= item.price;

                return (
                  <StickerCard
                    key={item.id}
                    className="flex items-center gap-3.5 p-4"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] bg-[#FFF0F0] shadow-[2px_2px_0px_#134E4A]">
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
                        <h3 className="text-sm font-black text-[#134E4A]">
                          {item.name}
                        </h3>
                        {isActive && (
                          <span className="text-[9px] font-extrabold bg-[#0D9488] text-white px-2 py-0.5 rounded-md border border-[#134E4A]">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-[#134E4A]/60 mt-0.5">
                        {item.desc}
                      </p>
                    </div>

                    <StickerButton
                      variant={
                        isSuperAdmin || affordable ? "primary" : "secondary"
                      }
                      size="sm"
                      className={`shrink-0 ${isSuperAdmin ? "border-[#F59E0B]" : ""}`}
                      disabled={!isSuperAdmin && !affordable}
                      onClick={() => handleBuyBooster(item)}
                    >
                      {isSuperAdmin ? (
                        <span className="text-[#0D9488]">GRATIS · Ambil</span>
                      ) : (
                        <>
                          <CoinSvg size={14} /> {item.price}
                        </>
                      )}
                    </StickerButton>
                  </StickerCard>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal Sukses Pembelian Tema (Pakai Sekarang) */}
      {purchasedThemeModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="relative w-full max-w-sm rounded-3xl border-4 border-[#134E4A] bg-[#F0FDF4] p-6 shadow-[6px_6px_0px_#134E4A] text-center">
            <div
              className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
              style={{ backgroundColor: purchasedThemeModal.item.swatch }}
            >
              <purchasedThemeModal.item.iconComponent
                size={32}
                className={purchasedThemeModal.item.iconColor}
              />
            </div>
            <h3 className="font-display text-xl font-black text-[#134E4A]">
              Alhamdulillah!
            </h3>
            <p className="mt-1 text-sm font-bold text-[#134E4A]/80">
              Tema <strong>{purchasedThemeModal.item.name}</strong> berhasil kamu dapatkan! Mau langsung memakainya sekarang?
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <StickerButton
                variant="primary"
                size="md"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  if (purchasedThemeModal.scope === "kamar") {
                    equipRoomTheme(purchasedThemeModal.item.id);
                  } else if (purchasedThemeModal.scope === "game") {
                    equipGameTheme(purchasedThemeModal.item.id);
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
                className="w-full py-2 text-xs font-bold text-[#134E4A]/70 hover:text-[#134E4A] cursor-pointer"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
