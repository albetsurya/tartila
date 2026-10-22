import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NGAJI_CERIA_ASSETS } from "../data/assets";
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
  ChevronRightSvg,
} from "@/components/ui/CustomIcons";
import { ChevronLeft, Info } from "@/components/ui/CustomIcons";
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
import {
  getProgress,
  spendCoins,
  subscribeProgress,
} from "./games/_shared/progression";
import { getMascotName, resolveMascotGender } from "@/utils/mascotHelper";

function useCoinsBalance(): number {
  const [coins, setCoins] = useState(() => getProgress().coins);
  useEffect(() => subscribeProgress(() => setCoins(getProgress().coins)), []);
  return coins;
}

type ShopTab = "energi" | "kostum" | "booster";

const ENERGY_ITEMS: Array<{
  kind: EnergyKind;
  name: string;
  desc: string;
  icon: string;
  accent: "coral" | "amber";
  max: number;
}> = [
  {
    kind: "heart",
    name: "1 Hati Belajar",
    desc: "Untuk masuk sesi belajar Tilawati.",
    icon: NGAJI_CERIA_ASSETS.hatiNyawa,
    accent: "coral",
    max: HEART_MAX,
  },
  {
    kind: "ticket",
    name: "1 Tiket Bermain",
    desc: "Untuk masuk ke Mini Games.",
    icon: NGAJI_CERIA_ASSETS.iconGames,
    accent: "amber",
    max: TICKET_MAX,
  },
];

const COSTUME_ITEMS = [
  {
    id: "peci",
    name: "Peci Santri",
    desc: "Songkok hitam berhias sulam emas khas santri cilik.",
    image: NGAJI_CERIA_ASSETS.peci,
    price: 200,
    accent: "teal",
    category: "boy" as const,
  },
  {
    id: "hairbow",
    name: "Pita Rambut",
    desc: "Pita cantik berwarna merah muda yang manis dan anggun.",
    iconComponent: SparklesSvg,
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
    image: NGAJI_CERIA_ASSETS.mahkotaVip,
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
    image: NGAJI_CERIA_ASSETS.hatiNyawa,
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

export default function WarungSantriPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as ShopTab) || "energi";
  const [activeTab, setActiveTab] = useState<ShopTab>(
    initialTab === "kostum" || initialTab === "booster" ? initialTab : "energi"
  );

  const coins = useCoinsBalance();
  const { user, groupId } = useAuth();
  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const isUnlimited = isUnlimitedUser(user, isVip, groupId);
  const grantEnergy = useEconomyStore((s) => s.grantEnergy);
  const purchasedToday = useEconomyStore((s) => s.purchasedToday);

  const ownedAccessories = useEconomyStore((s) => s.ownedAccessories);
  const equippedAccessory = useEconomyStore((s) => s.equippedAccessory);
  const buyAccessory = useEconomyStore((s) => s.buyAccessory);
  const equipAccessory = useEconomyStore((s) => s.equipAccessory);
  const setTilaGender = useEconomyStore((s) => s.setTilaGender);
  const [costumeFilter, setCostumeFilter] = useState<"all" | "boy" | "girl">("all");

  const activeBoosters = useEconomyStore((s) => s.activeBoosters);
  const buyBooster = useEconomyStore((s) => s.buyBooster);

  const tilaGender = useEconomyStore((s) => s.tilaGender || s.bibiGender);
  const mascotName = getMascotName(tilaGender);

  const [message, setMessage] = useState<string | null>(null);

  const stock: Record<EnergyKind, number> = { heart: hearts, ticket: tickets };

  const handleExchangeEnergy = (item: (typeof ENERGY_ITEMS)[number]) => {
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
    if (!spendCoins(price)) {
      setMessage("Koin Hijaiyah-mu belum cukup.");
      return;
    }
    grantEnergy(item.kind);
    setMessage("Berhasil ditukar!");
  };

  const handleBuyCostume = (item: (typeof COSTUME_ITEMS)[number]) => {
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

    if (coins < item.price) {
      setMessage("Koin Hijaiyah-mu belum cukup untuk kostum ini.");
      return;
    }

    const success = buyAccessory(item.id, item.price);
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

  const handleBuyBooster = (item: (typeof BOOSTER_ITEMS)[number]) => {
    if (item.id === "full-heart" && hearts >= HEART_MAX) {
      setMessage("Hatimu sudah penuh maksimal!");
      return;
    }
    if (coins < item.price) {
      setMessage("Koin Hijaiyah-mu belum cukup untuk booster ini.");
      return;
    }
    const success = buyBooster(item.id, item.price);
    if (success) {
      setMessage(`Alhamdulillah! ${item.name} berhasil diaktifkan!`);
    } else {
      setMessage("Koin Hijaiyah-mu belum cukup.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF4] relative overflow-hidden flex flex-col">
      {/* HEADER MANUAL (STICKER NEO-BRUTALISM) */}
      <div className="sticky top-0 z-50 bg-[#F0FDF4]/95 px-4 py-3 flex items-center justify-between border-b-[3px] border-[#134E4A] shadow-[0_2px_0px_#134E4A]">
        <button
          onClick={() => navigate(-1)}
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
        {/* HEADER MASKOT & STATUS */}
        <div className="flex flex-col items-center justify-center text-center pt-2 pb-2">
          <img
            src={NGAJI_CERIA_ASSETS.petiHarta}
            alt="Peti Harta"
            className="w-20 h-20 object-contain mb-2 drop-shadow-md"
          />
          <h2 className="font-display text-2xl font-black text-[#134E4A]">
            Warung Santri
          </h2>
          <p className="text-xs font-bold text-[#134E4A]/60 mt-0.5 mb-4 max-w-[260px]">
            Tukar Koin Hijaiyah-mu dengan energi, busana {mascotName}, atau booster seru!
          </p>

          {/* PANEL STATUS (Koin, Hati, Tiket) */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[320px] mx-auto">
            {/* Koin */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[#134E4A] bg-[#FEF3C7] py-2 shadow-[2px_2px_0px_#134E4A]">
              <img
                src={NGAJI_CERIA_ASSETS.koinHijaiyah}
                alt="Koin"
                className="w-5 h-5 object-contain"
              />
              <span className="text-xs font-black text-[#134E4A]">{coins}</span>
            </div>

            {/* Hati */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[#134E4A] bg-[#FFF0F0] py-2 shadow-[2px_2px_0px_#134E4A]">
              <img
                src={NGAJI_CERIA_ASSETS.hatiNyawa}
                alt="Hati"
                className="w-5 h-5 object-contain"
              />
              <span className="text-xs font-black text-[#134E4A]">
                {isVip ? "∞" : `${hearts}/${HEART_MAX}`}
              </span>
            </div>

            {/* Tiket */}
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl border-[2px] border-[#134E4A] bg-[#F0FDF4] py-2 shadow-[2px_2px_0px_#134E4A]">
              <img
                src={NGAJI_CERIA_ASSETS.iconGames}
                alt="Tiket"
                className="w-5 h-5 object-contain"
              />
              <span className="text-xs font-black text-[#134E4A]">
                {isVip ? "∞" : `${tickets}/${TICKET_MAX}`}
              </span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION (STICKER STYLE) */}
        <div className="mt-5 grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-white border-[3px] border-[#134E4A] shadow-[3px_3px_0px_#134E4A]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("energi");
              setSearchParams({ tab: "energi" });
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "energi"
                ? "bg-[#0D9488] text-white shadow-[2px_2px_0px_#134E4A] border-2 border-[#134E4A] -translate-y-0.5"
                : "text-[#134E4A] hover:bg-gray-100"
            }`}
          >
            <ZapSvg size={14} />
            <span>Energi</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("kostum");
              setSearchParams({ tab: "kostum" });
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "kostum"
                ? "bg-[#FF6B6B] text-white shadow-[2px_2px_0px_#134E4A] border-2 border-[#134E4A] -translate-y-0.5"
                : "text-[#134E4A] hover:bg-gray-100"
            }`}
          >
            <ShirtSvg size={14} />
            <span>Kostum {mascotName}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("booster");
              setSearchParams({ tab: "booster" });
            }}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "booster"
                ? "bg-[#F59E0B] text-white shadow-[2px_2px_0px_#134E4A] border-2 border-[#134E4A] -translate-y-0.5"
                : "text-[#134E4A] hover:bg-gray-100"
            }`}
          >
            <ZapSvg size={14} />
            <span>Booster</span>
          </button>
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
                Maksimal {SHOP_DAILY_LIMIT} penukaran per item energi setiap hari.
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
                const soldOut = purchasedToday(item.kind) >= SHOP_DAILY_LIMIT;
                const full = stock[item.kind] >= item.max;
                const affordable = coins >= price && !isVip && !soldOut && !full;

                return (
                  <StickerCard
                    key={item.kind}
                    className="flex items-center gap-3 p-4"
                  >
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] ${
                        item.accent === "coral" ? "bg-[#FFF0F0]" : "bg-[#FEF3C7]"
                      }`}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        className="h-8 w-8 object-contain"
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
                        Sisa hari ini: {SHOP_DAILY_LIMIT - purchasedToday(item.kind)}x ({stock[item.kind]}/{item.max})
                      </p>
                    </div>
                    <StickerButton
                      variant={affordable ? "primary" : "secondary"}
                      size="sm"
                      className="shrink-0"
                      disabled={!affordable}
                      onClick={() => handleExchangeEnergy(item)}
                    >
                      <CoinSvg size={14} /> {price}
                    </StickerButton>
                  </StickerCard>
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
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-8 w-8 object-contain"
                        />
                      ) : item.iconComponent ? (
                        <item.iconComponent
                          size={24}
                          className={item.accent === "coral" ? "text-[#FB7185]" : "text-[#0284C7]"}
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-black text-[#134E4A]">
                          {item.name}
                        </h3>
                        {item.category === "boy" ? (
                          <span className="text-[9px] font-extrabold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded-md border border-[#134E4A]">
                            Khusus Tito
                          </span>
                        ) : item.category === "girl" ? (
                          <span className="text-[9px] font-extrabold bg-[#FCE7F3] text-[#BE185D] px-2 py-0.5 rounded-md border border-[#134E4A]">
                            Khusus Tila
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
                        variant={affordable ? "primary" : "secondary"}
                        size="sm"
                        className="shrink-0"
                        disabled={!affordable}
                        onClick={() => handleBuyCostume(item)}
                      >
                        <CoinSvg size={14} /> {item.price}
                      </StickerButton>
                    )}
                  </StickerCard>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: BOOSTER */}
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
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-8 w-8 object-contain"
                        />
                      ) : item.iconComponent ? (
                        <item.iconComponent
                          size={24}
                          className={
                            item.accent === "amber"
                              ? "text-[#F59E0B]"
                              : "text-[#0284C7]"
                          }
                        />
                      ) : null}
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
                      variant={affordable ? "primary" : "secondary"}
                      size="sm"
                      className="shrink-0"
                      disabled={!affordable}
                      onClick={() => handleBuyBooster(item)}
                    >
                      <CoinSvg size={14} /> {item.price}
                    </StickerButton>
                  </StickerCard>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
