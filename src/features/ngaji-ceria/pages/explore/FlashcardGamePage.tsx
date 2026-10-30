import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ChevronLeft } from "../../../../components/ui/CustomIcons";
import { AppModal } from "../../../../components/ui/AppModal";

const CARD_LABELS = [
  "ا",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
];
const ARABIC_TEXTS = [
  "بِسْمِ اللَّهِ",
  "ٱلْحَمْدُ لِلَّهِ",
  "ٱللَّهُ أَكْبَر",
  "ٱدْخُلُوا فِي ٱلْإِسْلَامِ",
  "ٱلَّذِینَ ھُدُوٓا",
  "قُلْ یَہَا کفَرُ",
  "قُلْ هُوَ اللَّهُ اَحَد",
  "قُلْ اعُوذُ بِرَبِّ الفَلَق",
  "قُلْ اعُوذُ بِرَبِّ النّاس",
  "سُبْحانَ اللَّهِ",
  "الْحَمْدُ لِلَّهِ",
];

interface CardData {
  id: number;
  label: string;
  arabic: string;
}

const INITIAL_CARDS: CardData[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  label: CARD_LABELS[i],
  arabic: ARABIC_TEXTS[i],
}));

export default function FlashcardGamePage() {
  const navigate = useNavigate();
  const { jilid } = useParams<{ jilid: string }>();
  const [cards] = useState<CardData[]>(() => [...INITIAL_CARDS]);
  const [flipped, setFlipped] = useState<Array<number>>([]);
  const [showModal, setShowModal] = useState(false);
  const currentArabic = cards[0]?.arabic || "";

  const handleFlip = (id: number) => {
    setFlipped((prev) => {
      if (prev.includes(id)) return [];
      return [...prev, id];
    });
  };

  const handleUjiLayar = () => {
    setShowModal(true);
  };

  const handleSudahDibaca = () => {
    setShowModal(false);
  };

  return (
    <NgajiCeriaLayout
      title={`Kemah Tilawati ${jilid || ""}`}
      onBack={() => navigate("/member/ngaji-ceria/explore/practice")}
    >
      {/* Latar Dalam Tenda Kemah Savana Krem Hangat (#FEF3C7) */}
      <div className="min-h-[100dvh] bg-[#FEF3C7] relative overflow-x-hidden pb-32 select-none">
        {/* Tirai Segitiga Kanvas Tenda di Atas */}
        <div
          className="h-5 w-full bg-[#D97706] border-b-[3px] border-[#451A03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #D97706 0px, #D97706 28px, #15803D 28px, #15803D 56px)",
          }}
        />

        {/* Header Papan Kayu Alam Terbuka */}
        <div className="px-4 py-3.5 bg-[#78350F] border-b-[4px] border-[#451A03] flex items-center justify-between shadow-[0_4px_0px_#451A03]">
          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria/explore/practice")}
            className="flex items-center gap-1.5 rounded-xl border-[3px] border-[#451A03] bg-[#FEF08A] px-3 py-1.5 text-xs font-black text-[#451A03] shadow-[3px_3px_0px_#451A03] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
          >
            <ChevronLeft size={14} />
            Kompas Kembali
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-[#15803D] border-[2.5px] border-[#451A03] px-2.5 py-1 text-xs font-black text-[#FFFFFF] shadow-[2px_2px_0px_#451A03]">
              Kemah Savana
            </span>
            <span className="rounded-lg bg-[#D97706] border-[2.5px] border-[#451A03] px-2.5 py-1 text-xs font-black text-[#FEF3C7] shadow-[2px_2px_0px_#451A03]">
              Jilid {jilid || "1"}
            </span>
          </div>
        </div>

        {/* Grid 12 Tenda Kemah Savana Mini */}
        <div className="px-4 py-7 max-w-3xl mx-auto grid grid-cols-3 gap-x-4 gap-y-7 sm:gap-x-5 sm:gap-y-8">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(card.id);
            const tiltClass =
              idx % 2 === 0 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]";

            return (
              <div
                key={card.id}
                className={`relative pt-6 transition-transform hover:-translate-y-1 ${tiltClass}`}
              >
                {/* Atap Tenda Segitiga dengan Clip-Path */}
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 h-7 bg-[#451A03] z-10"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
                  }}
                >
                  <div
                    className={`w-full h-full ${
                      isFlipped ? "bg-[#15803D]" : "bg-[#D97706]"
                    }`}
                    style={{
                      clipPath: "polygon(50% 15%, 94% 100%, 6% 100%)",
                    }}
                  />
                </div>

                {/* Badan Tenda Kartu */}
                <div
                  className={`rounded-b-2xl rounded-t-sm border-[4px] border-[#451A03] aspect-[3/3.6] flex flex-col items-center justify-center relative shadow-[5px_5px_0px_#451A03] overflow-hidden ${
                    isFlipped ? "bg-[#DCFCE7]" : "bg-[#FFFBEB]"
                  }`}
                >
                  {/* Nomor & Lentera Bintang */}
                  <span className="absolute top-2 left-2 rounded-md bg-[#FEF08A] border-[2px] border-[#451A03] px-1.5 py-0.2 text-[10px] font-black text-[#451A03]">
                    #{card.id}
                  </span>
                  <span className="absolute top-2 right-2">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#FACC15"
                      stroke="#451A03"
                      strokeWidth="2.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </span>

                  {!isFlipped && (
                    <span className="game-arabic inline-block text-5xl font-black text-[#451A03] select-none mt-4">
                      {card.label}
                    </span>
                  )}

                  {/* Tampilan Saat Tirai Tenda Terbuka */}
                  {isFlipped && (
                    <div className="w-full h-full flex flex-col items-center justify-center pt-7 pb-3 px-2 text-center">
                      <p className="game-arabic text-2xl sm:text-3xl font-black text-[#14532D] mb-3 select-none">
                        {card.arabic}
                      </p>
                      <button
                        onClick={() => handleUjiLayar()}
                        className="mt-1 rounded-xl px-3 py-1.5 text-xs font-black text-[#FEF3C7] border-[2.5px] border-[#451A03] bg-[#78350F] shadow-[2px_2px_0px_#451A03] active:scale-95 transition-all cursor-pointer"
                      >
                        Uji Layar
                      </button>
                    </div>
                  )}

                  {!isFlipped && (
                    <div
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => handleFlip(card.id)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Control Bar: Papan Kayu & Panah Penunjuk Savana */}
        <div className="px-4 py-3.5 border-t-[4px] border-[#451A03] bg-[#78350F] fixed bottom-0 left-0 right-0 z-30">
          <div className="max-w-3xl mx-auto grid grid-cols-3 gap-3">
            <button className="col-span-1 rounded-xl border-[3px] border-[#451A03] bg-[#D97706] text-[#FEF3C7] font-black text-xs sm:text-sm py-2.5 px-3 shadow-[3px_3px_0px_#451A03] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer">
              Acak Tenda
            </button>

            <button className="col-span-1 rounded-xl border-[3px] border-[#451A03] bg-[#FEF08A] text-[#451A03] font-black text-xs sm:text-sm py-2.5 px-3 shadow-[3px_3px_0px_#451A03] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer">
              Buka Semua
            </button>

            <button className="col-span-1 rounded-xl border-[3px] border-[#451A03] bg-[#15803D] text-[#FFFFFF] font-black text-xs sm:text-sm py-2.5 px-3 shadow-[3px_3px_0px_#451A03] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer">
              Selesai
            </button>
          </div>
        </div>

        {/* Modal: Uji Layar di Papan Kayu Kemah */}
        <AppModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Uji Layar Kemah"
        >
          <div className="rounded-2xl border-[4px] border-[#451A03] bg-[#FEF3C7] p-6 mb-5 shadow-[4px_4px_0px_#451A03]">
            <p className="text-5xl font-black text-[#451A03] text-center select-none">
              {currentArabic}
            </p>
          </div>
          <button
            onClick={handleSudahDibaca}
            className="w-full rounded-xl border-[3px] border-[#451A03] bg-[#15803D] text-[#FFFFFF] font-black text-sm py-3 px-6 shadow-[4px_4px_0px_#451A03] hover:bg-[#166534] transition-colors cursor-pointer"
          >
            Sudah Dibaca
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 w-full font-black text-xs text-[#78350F] hover:text-[#451A03] transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </AppModal>
      </div>
    </NgajiCeriaLayout>
  );
}
