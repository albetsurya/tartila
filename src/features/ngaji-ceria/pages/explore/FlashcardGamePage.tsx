import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ChevronLeft } from "../../../../components/ui/FontAwesomeIcons";

const ANIMALS = [
  "🐧",
  "🐬",
  "🦦",
  "🐯",
  "🐸",
  "🐢",
  "🦅",
  "🦒",
  "🦓",
  "🦔",
  "🦘",
  "🐍",
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
  animal: string;
  arabic: string;
}

const INITIAL_CARDS: CardData[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  animal: ANIMALS[i],
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
                className="rounded-2xl shadow-sm border border-gray-100 bg-white aspect-[3/4] flex flex-col items-center justify-center relative"
              >
                {/* Front: Emoji animal */}
                <span className="absolute top-2 left-2 text-xs font-bold text-[#64748B]">
                  #{card.id}
                </span>
                <span className="absolute top-2 right-2 text-2xl text-[#FF6B6B]">
                  ⭐
                </span>
                <span className="inline-block text-5xl font-emoji select-none">
                  {card.animal}
                </span>

                {/* Back: Arabic text and button */}
                {isFlipped && (
                  <div className="w-full h-full flex flex-col items-center justify-center pt-8 pb-4 text-center">
                    <p className="text-4xl font-black text-[#134E4A] mb-4 select-none">
                      {card.arabic}
                    </p>
                    <button
                      onClick={() => handleUjiLayar()}
                      className="mt-3 rounded-lg px-6 py-2.5 text-sm font-bold text-white transition-colors"
                      style={{ backgroundColor: "#FF6B6B" }}
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
        <div className="px-4 py-3 border-t border-gray-200 bg-white sticky bottom-0">
          <div className="grid grid-cols-3 gap-2">
            {/* Acak Kartu */}
            <button className="col-span-1 rounded-lg bg-[#0D9488] text-white font-bold text-sm py-2 px-3 shadow-sm hover:bg-[#134E4A] transition-colors">
              Acak Kartu
            </button>

            {/* Buka */}
            <button className="col-span-1 rounded-lg bg-[#134E4A] text-white font-bold text-sm py-2 px-3 shadow-sm hover:bg-[#0D9488] transition-colors">
              Buka
            </button>

            {/* Selesai */}
            <button className="col-span-1 rounded-lg bg-gray-300 text-gray-700 font-bold text-sm py-2 px-3 shadow-sm">
              Selesai
            </button>
          </div>
        </div>

        {/* Modal: Uji Layar */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 transform scale-95 opacity-0 transition-all duration-300"
              style={{ transform: "scale(1)" }}
            >
              <p className="text-5xl font-black text-[#134E4A] mb-6 text-center select-none">
                {currentArabic}
              </p>
              <button
                onClick={handleSudahDibaca}
                className="w-full rounded-lg bg-[#0D9488] text-white font-bold text-sm py-3 px-6 shadow-md hover:bg-[#134E4A] transition-colors"
              >
                Sudah Dibaca
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 text-gray-500 hover:text-[#134E4A] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </NgajiCeriaLayout>
  );
}
