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
      title={`Tilawati ${jilid || ""}`}
      onBack={() => navigate("/member/ngaji-ceria/explore/practice")}
    >
      <div className="min-h-full bg-[#F0FDF4]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria/explore/practice")}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[#0D9488] hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={14} />
            Kembali
          </button>
          <span className="mx-4 text-sm text-[#64748B]">Iqro </span>
          <span className="ml-auto text-sm text-[#64748B]">
            Jilid {jilid || ""}
          </span>
        </div>

        {/* Grid of Cards */}
        <div className="px-4 py-6 grid grid-cols-3 gap-4">
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.id);
            return (
              <div
                key={card.id}
                className="rounded-2xl border-[3px] border-[#134E4A] bg-white aspect-[3/4] flex flex-col items-center justify-center relative shadow-[3px_3px_0px_#134E4A]"
              >
                {/* Front: Hijaiyah card */}
                <span className="absolute top-2 left-2 text-xs font-black text-[#134E4A]/60">
                  #{card.id}
                </span>
                <span className="absolute top-2 right-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FACC15" stroke="#134E4A" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
                <span className="game-arabic inline-block text-5xl font-black text-[#134E4A] select-none">
                  {card.label}
                </span>

                {/* Back: Arabic text and button */}
                {isFlipped && (
                  <div className="w-full h-full flex flex-col items-center justify-center pt-8 pb-4 text-center">
                    <p className="game-arabic text-3xl font-black text-[#134E4A] mb-4 select-none">
                      {card.arabic}
                    </p>
                    <button
                      onClick={() => handleUjiLayar()}
                      className="mt-3 rounded-xl px-5 py-2 text-sm font-black text-white border-2 border-[#134E4A] bg-[#FF6B6B] shadow-[2px_2px_0px_#134E4A] active:scale-95 transition-all"
                    >
                      Uji Layar
                    </button>
                  </div>
                )}

                {/* Front overlay when not flipped */}
                {!isFlipped && (
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => handleFlip(card.id)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Bar */}
        <div className="px-4 py-3 border-t-2 border-[#134E4A] bg-white sticky bottom-0">
          <div className="grid grid-cols-3 gap-2">
            {/* Acak Kartu */}
            <button className="col-span-1 rounded-xl border-2 border-[#134E4A] bg-[#0D9488] text-white font-black text-sm py-2 px-3 shadow-[2px_2px_0px_#134E4A] active:scale-95 transition-all">
              Acak Kartu
            </button>

            {/* Buka */}
            <button className="col-span-1 rounded-xl border-2 border-[#134E4A] bg-[#134E4A] text-white font-black text-sm py-2 px-3 shadow-[2px_2px_0px_#134E4A] active:scale-95 transition-all">
              Buka
            </button>

            {/* Selesai */}
            <button className="col-span-1 rounded-lg border-2 border-[#134E4A] bg-gray-200 text-[#134E4A] font-bold text-sm py-2 px-3 shadow-[2px_2px_0px_#134E4A]">
              Selesai
            </button>
          </div>
        </div>

        {/* Modal: Uji Layar */}
        <AppModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Uji Layar"
        >
          <p className="text-5xl font-black text-[#134E4A] mb-6 text-center select-none">
            {currentArabic}
          </p>
          <button
            onClick={handleSudahDibaca}
            className="w-full rounded-lg border-2 border-[#134E4A] bg-[#0D9488] text-white font-bold text-sm py-3 px-6 shadow-[2px_2px_0px_#134E4A] hover:bg-[#134E4A] transition-colors"
          >
            Sudah Dibaca
          </button>
          <button
            onClick={() => setShowModal(false)}
            className="mt-4 text-gray-500 hover:text-[#134E4A] transition-colors"
          >
            Tutup
          </button>
        </AppModal>
      </div>
    </NgajiCeriaLayout>
  );
}
