import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan import ini
import { NGAJI_CERIA_ASSETS } from "../data/assets";
import { StickerButton, StickerCard, SectionHeader } from "@/components/ui";
import { Coins, Info, ChevronLeft } from "@/components/ui/FontAwesomeIcons"; // Tambahkan ChevronLeft
import {
  ENERGY_PRICES,
  HEART_MAX,
  SHOP_DAILY_LIMIT,
  TICKET_MAX,
  useEconomyStore,
  type EnergyKind,
} from "../hooks/useEconomyStore";
import {
  getProgress,
  spendCoins,
  subscribeProgress,
} from "./games/_shared/progression";

function useCoinsBalance(): number {
  const [coins, setCoins] = useState(() => getProgress().coins);
  useEffect(() => subscribeProgress(() => setCoins(getProgress().coins)), []);
  return coins;
}

const ITEMS: Array<{
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

export default function WarungSantriPage() {
  const navigate = useNavigate(); // Inisialisasi navigate
  const coins = useCoinsBalance();
  const hearts = useEconomyStore((s) => s.hearts);
  const tickets = useEconomyStore((s) => s.tickets);
  const isVip = useEconomyStore((s) => s.isVip);
  const grantEnergy = useEconomyStore((s) => s.grantEnergy);
  const purchasedToday = useEconomyStore((s) => s.purchasedToday);
  const [message, setMessage] = useState<string | null>(null);

  const stock: Record<EnergyKind, number> = { heart: hearts, ticket: tickets };

  const handleExchange = (item: (typeof ITEMS)[number]) => {
    const price = ENERGY_PRICES[item.kind];

    if (isVip) {
      setMessage("Kamu VIP — energi tidak terbatas!");
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

  return (
    // Wrapper utama tanpa NgajiCeriaLayout
    <div className="min-h-screen bg-[#F0FDF4] relative overflow-hidden flex flex-col">
      {/* HEADER MANUAL (INDEPENDEN) */}
      <div className="sticky top-0 z-50 bg-[#F0FDF4]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b-[3px] border-[#134E4A]">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border-[3px] border-[#134E4A] bg-white shadow-[2px_2px_0px_#134E4A] active:translate-y-[2px] active:shadow-none transition-all"
        >
          <ChevronLeft size={20} className="text-[#134E4A]" />
        </button>
        <h1 className="font-display font-black text-[#134E4A] text-lg">
          Warung Santri
        </h1>
        <div className="w-10" />{" "}
        {/* Spacer untuk menyeimbangkan judul di tengah */}
      </div>

      {/* KONTEN SCROLLABLE */}
      <div className="px-4 py-4 pb-20 flex-1 overflow-y-auto flex flex-col">
        {/* HEADER MASKOT & STATUS */}
        <div className="flex flex-col items-center justify-center text-center min-h-[35vh] pt-2 pb-2">
          <img
            src={NGAJI_CERIA_ASSETS.petiHarta}
            alt="Peti Harta"
            className="w-24 h-24 object-contain mb-2 drop-shadow-md"
          />
          <h2 className="font-display text-2xl font-black text-[#134E4A]">
            Warung Santri
          </h2>
          <p className="text-xs font-bold text-[#134E4A]/60 mt-1 mb-6 max-w-[250px]">
            Tukar Koin Hijaiyah-mu dengan energi belajar & bermain.
          </p>

          {/* PANEL STATUS (Koin, Hati, Tiket) */}
          <div className="grid grid-cols-3 gap-2.5 w-full max-w-[300px] mx-auto">
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

        {/* KONTEN BAWAH */}
        <div className="space-y-4 mt-6">
          {/* INFO BATAS HARIAN */}
          <div className="flex items-center gap-2 rounded-xl border-[2px] border-[#0284C7] bg-[#E0F2FE] p-2.5 shadow-[2px_2px_0px_#0284C7]">
            <Info size={16} className="shrink-0 text-[#0284C7]" />
            <p className="text-[10px] font-bold text-[#0284C7]">
              Maksimal {SHOP_DAILY_LIMIT} penukaran per item setiap hari.
            </p>
          </div>

          {/* NOTIFIKASI */}
          {message && (
            <div
              role="status"
              className="rounded-xl border-[2px] border-[#F59E0B] bg-[#FEF3C7] p-2.5 text-center text-xs font-black text-[#B45309]"
            >
              {message}
            </div>
          )}

          <SectionHeader
            title="Tukar Koin"
            icon={<Coins size={16} />}
            accent="teal"
          />

          {/* DAFTAR ITEM */}
          <div className="space-y-3 pb-8">
            {ITEMS.map((item) => {
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
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#134E4A] ${item.accent === "coral" ? "bg-[#FFF0F0]" : "bg-[#FEF3C7]"}`}
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
                      Sisa: {stock[item.kind]}/{item.max}
                    </p>
                  </div>
                  <StickerButton
                    variant={affordable ? "primary" : "secondary"}
                    size="sm"
                    className="shrink-0"
                    disabled={!affordable}
                    onClick={() => handleExchange(item)}
                  >
                    <Coins size={14} /> {price}
                  </StickerButton>
                </StickerCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
