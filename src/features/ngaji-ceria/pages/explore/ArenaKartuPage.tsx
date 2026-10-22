import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  ArrowLeft,
  ChevronRight,
  StickerButton,
  StickerCard,
  ShuffleSvg,
  PlaySvg,
  XSvg,
  CheckSvg,
  StarSvg,
  BookOpenSvg,
} from "../../../../components/ui";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

const CARD_BACKS = {
  moon: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 14.5C20 18.6421 16.6421 22 12.5 22C8.35786 22 5 18.6421 5 14.5C5 10.3579 8.35786 7 12.5 7C16.6421 7 20 10.3579 20 14.5Z"
        fill="#FEF08A"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M15 2L15.5 4.5L18 5L15.5 5.5L15 8L14.5 5.5L12 5L14.5 4.5L15 2Z"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  star: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z"
        fill="#FBBF24"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  book: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
        fill="#2DD4BF"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 5C9 3.5 5 3.5 5 6V17C5 17 9 15 12 17C15 15 19 17 19 17V6C19 3.5 15 3.5 12 5Z"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 5V17"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  mosque: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 21V11C4 11 7 8 12 8C17 8 20 11 20 11V21"
        fill="#38BDF8"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 8V4"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="3"
        r="1.5"
        fill="#FBBF24"
        stroke="#134E4A"
        strokeWidth="2"
      />
      <path
        d="M2 21H22"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M10 21V15C10 13.8954 10.8954 13 12 13C13.1046 13 14 13.8954 14 15V21"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="2.5"
      />
    </svg>
  ),
  lantern: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 6H16L18 10V16L16 20H8L6 16V10L8 6Z"
        fill="#F59E0B"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 6V4H15V6"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M8 10H16M8 16H16"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  cloud: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  sun: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="5"
        fill="#FEF08A"
        stroke="#134E4A"
        strokeWidth="2.5"
      />
      <path
        d="M12 2V4M12 20V22M2 12H4M20 12H22M4.92893 4.92893L6.34315 6.34315M17.6569 17.6569L19.0711 19.0711M19.0711 4.92893L17.6569 6.34315M6.34315 17.6569L4.92893 19.0711"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  sparkle: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3L13.5 9L19.5 10.5L13.5 12L12 18L10.5 12L4.5 10.5L10.5 9L12 3Z"
        fill="#FF6B6B"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle
        cx="19"
        cy="5"
        r="2"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="2"
      />
      <circle
        cx="5"
        cy="19"
        r="1.5"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="2"
      />
    </svg>
  ),
  heart: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21C12 21 3 14.5 3 8.5C3 5.5 5.5 3 8.5 3C10.5 3 12 4.5 12 4.5C12 4.5 13.5 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14.5 12 21 12 21Z"
        fill="#FF6B6B"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
  shield: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z"
        fill="#0D9488"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 12L11 14L15 10"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  compass: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="#FFFFFF"
        stroke="#134E4A"
        strokeWidth="2.5"
      />
      <path
        d="M16 8L14 14L8 16L10 10L16 8Z"
        fill="#FF6B6B"
        stroke="#134E4A"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  flag: (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 22V4"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M4 4H18L14 9L18 14H4"
        fill="#FBBF24"
        stroke="#134E4A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const INITIAL_CARDS = [
  {
    id: 1,
    iconName: "moon" as keyof typeof CARD_BACKS,
    letter: "ا",
    latin: "Alif",
  },
  {
    id: 2,
    iconName: "star" as keyof typeof CARD_BACKS,
    letter: "ب",
    latin: "Ba",
  },
  {
    id: 3,
    iconName: "book" as keyof typeof CARD_BACKS,
    letter: "ت",
    latin: "Ta",
  },
  {
    id: 4,
    iconName: "mosque" as keyof typeof CARD_BACKS,
    letter: "ث",
    latin: "Tsa",
  },
  {
    id: 5,
    iconName: "lantern" as keyof typeof CARD_BACKS,
    letter: "ج",
    latin: "Jim",
  },
  {
    id: 6,
    iconName: "cloud" as keyof typeof CARD_BACKS,
    letter: "ح",
    latin: "Ha",
  },
  {
    id: 7,
    iconName: "sun" as keyof typeof CARD_BACKS,
    letter: "خ",
    latin: "Kho",
  },
  {
    id: 8,
    iconName: "sparkle" as keyof typeof CARD_BACKS,
    letter: "د",
    latin: "Dal",
  },
  {
    id: 9,
    iconName: "heart" as keyof typeof CARD_BACKS,
    letter: "ذ",
    latin: "Dzal",
  },
  {
    id: 10,
    iconName: "shield" as keyof typeof CARD_BACKS,
    letter: "ر",
    latin: "Ra",
  },
  {
    id: 11,
    iconName: "compass" as keyof typeof CARD_BACKS,
    letter: "ز",
    latin: "Zai",
  },
  {
    id: 12,
    iconName: "flag" as keyof typeof CARD_BACKS,
    letter: "س",
    latin: "Sin",
  },
];

export default function ArenaKartuPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleShuffle = () => {
    triggerBibiReaction("click");
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  const handleOpenAll = () => {
    triggerBibiReaction("success");
    if (flipped.length === cards.length) {
      setFlipped([]);
    } else {
      setFlipped(cards.map((c) => c.id));
    }
  };

  const handleCardClick = (id: number) => {
    triggerBibiReaction("click");
    if (flipped.includes(id)) {
      setFlipped(flipped.filter((fId) => fId !== id));
    } else {
      setFlipped([...flipped, id]);
    }
  };

  const handleOpenModal = (id: number) => {
    triggerBibiReaction("play");
    setActiveCard(id);
    setIsModalOpen(true);
  };

  const handleNextModal = () => {
    if (activeCard === null) return;
    const currentIndex = cards.findIndex((c) => c.id === activeCard);
    const nextIndex = (currentIndex + 1) % cards.length;
    setActiveCard(cards[nextIndex].id);
  };

  const handlePrevModal = () => {
    if (activeCard === null) return;
    const currentIndex = cards.findIndex((c) => c.id === activeCard);
    const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    setActiveCard(cards[prevIndex].id);
  };

  const currentCardData = cards.find((c) => c.id === activeCard);

  return (
    <NgajiCeriaLayout
      title="Arena Kartu"
      hideHeader={true}
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      {/* Meja kasino duel — fullscreen */}
      <div className="min-h-[100dvh] w-full bg-[#065F46] relative overflow-x-hidden pb-56">
        {/* Permukaan felt + bingkai kayu tepi */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 30%, #10B98122 0, transparent 60%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            boxShadow: "inset 0 0 0 10px #B45309, inset 0 0 0 13px #78350F",
          }}
        />
        {/* Titik lampu di tepi meja */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-3 flex justify-around z-10">
          {["#FEF08A", "#FEF08A", "#FEF08A", "#FEF08A", "#FEF08A", "#FEF08A", "#FEF08A", "#FEF08A"].map((c, i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full -mt-0.5 drop-shadow-[0_2px_2px_rgba(254,240,138,0.8)]"
              style={{ background: c }}
            />
          ))}
        </div>

        <div className="relative z-20">
          {/* HEADER: Papan skor turnamen */}
          <ThemedHeader
            title="Arena Kartu"
            onBack={() => navigate("/member/ngaji-ceria/map")}
            themeColorClass="bg-[#1E1B4B]"
            textColorClass="text-[#FDE68A]"
            statVariant="wood"
            statBgClass="bg-[#0F172A]"
            statTextClass="text-[#FDE68A]"
            backClass="bg-[#B45309]"
          />

          {/* Panel instruksi: papan gantung */}
          <div className="px-4 pt-6">
            <div className="relative mx-auto max-w-sm">
              <div className="flex justify-center gap-6 mb-[-6px] relative z-10">
                <span className="w-2 h-5 bg-[#FEF3C7] border-2 border-[#B45309]" />
                <span className="w-2 h-5 bg-[#FEF3C7] border-2 border-[#B45309]" />
              </div>
              <StickerCard className="p-4 text-center !bg-[#FEF3C7] !border-[3px] !border-[#B45309] !shadow-[4px_4px_0px_#78350F]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#B91C1C]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#B91C1C] mb-2 border-2 border-dashed border-[#B91C1C]/30">
                  <BookOpenSvg size={14} /> Duel Hijaiyah
                </span>
                <h2 className="font-display text-lg font-black text-[#7C2D12]">
                  Ketuk kartu untuk membuka tulisan Arab
                </h2>
                <p className="text-[11px] font-bold text-[#92400E]/70 mt-1">
                  Uji hafalan huruf hijaiyahmu di atas meja hijau!
                </p>
              </StickerCard>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 px-4 pt-4">
            {cards.map((card) => {
              const isFlipped = flipped.includes(card.id);
              return (
                <motion.div
                  key={card.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(card.id)}
                  className={`relative aspect-[3/4] flex flex-col items-center justify-center rounded-xl border-[3px] p-2 cursor-pointer transition-all ${
                    isFlipped
                      ? "bg-[#FFFBEB] border-[#B91C1C] shadow-[4px_5px_0px_#78350F, 8px_10px_0px_#065F46]"
                      : "bg-white border-[#134E4A] shadow-[4px_4px_0px_#134E4A, 8px_10px_0px_rgba(0,0,0,0.35)]"
                  }`}
                >
                  <div className="absolute top-1.5 left-2 text-[9px] font-black text-[#134E4A]/40">
                    #{card.id.toString().padStart(2, "0")}
                  </div>
                  <div className="absolute top-1.5 right-2 text-[#FBBF24]">
                    <StarSvg size={10} />
                  </div>

                  {isFlipped ? (
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <span className="font-arabic text-4xl text-[#134E4A] leading-none mb-2">
                        {card.letter}
                      </span>
                      <span className="text-[9px] font-black text-[#B91C1C] uppercase tracking-wider bg-[#FECACA] px-1.5 py-0.5 rounded border border-[#B91C1C]/30">
                        {card.latin}
                      </span>
                      <StickerButton
                        variant="primary"
                        size="sm"
                        className="mt-2 !px-2 !py-1 !text-[8px] !border-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(card.id);
                        }}
                      >
                        Uji <ChevronRight size={8} />
                      </StickerButton>
                    </div>
                  ) : (
                    <div className="opacity-95 drop-shadow-sm">
                      {CARD_BACKS[card.iconName]}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Action Bar */}
          <div className="fixed bottom-28 left-0 right-0 z-40 px-4 pr-[72px]">
            <StickerCard className="mx-auto max-w-md flex gap-2 p-2 !bg-[#1E1B4B] !border-[3px] !border-[#FDE68A] !shadow-[0_5px_0px_#0F172A]">
              <StickerButton
                variant="secondary"
                size="sm"
                fullWidth
                onClick={handleShuffle}
                className="!py-2.5"
              >
                <ShuffleSvg size={15} /> Acak
              </StickerButton>
              <StickerButton
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleOpenAll}
                className="!py-2.5"
              >
                <PlaySvg size={15} /> Buka
              </StickerButton>
              <StickerButton
                variant="danger"
                size="sm"
                fullWidth
                onClick={() => {
                  triggerBibiReaction("exit");
                  navigate("/member/ngaji-ceria/map");
                }}
                className="!py-2.5"
              >
                <XSvg size={15} /> Selesai
              </StickerButton>
            </StickerCard>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && currentCardData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <StickerCard
              asButton={false}
              className="w-full max-w-sm rounded-[32px] p-6 shadow-[8px_8px_0px_#FF6B6B] !border-[4px]"
            >
              <div className="flex items-center justify-between mb-6">
                <StickerButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  <ArrowLeft size={14} /> Kembali
                </StickerButton>
                <span className="rounded-lg bg-[#0D9488]/10 px-2.5 py-1 text-[10px] font-black text-[#0D9488] border border-[#0D9488]/20">
                  Huruf {currentCardData.letter}
                </span>
                <div className="w-8 h-8 rounded-full bg-[#FEF3C7] border-2 border-[#134E4A] flex items-center justify-center text-[#D97706]">
                  <CheckSvg size={14} />
                </div>
              </div>

              <div className="relative rounded-3xl border-[3px] border-[#134E4A] bg-[#F0FDF4] py-12 flex flex-col items-center justify-center shadow-[inset_0_-4px_0_rgba(19,78,74,0.1)]">
                <span className="font-arabic text-7xl text-[#134E4A] leading-none mb-4">
                  {currentCardData.letter}
                </span>
                <span className="text-sm font-black text-[#FF6B6B] tracking-widest uppercase">
                  {currentCardData.latin}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#FFF0F0] px-3 py-2 border-2 border-[#FF6B6B]/20 text-[10px] font-bold text-[#FF6B6B]">
                <StarSvg size={14} /> Uji Membaca: Bacalah dengan suara jelas
              </div>

              <div className="mt-6 flex items-center gap-3">
                <StickerButton
                  variant="secondary"
                  onClick={handlePrevModal}
                  className="!w-12 !h-12 !p-0 !rounded-xl"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </StickerButton>
                <StickerButton
                  variant="primary"
                  fullWidth
                  onClick={() => setIsModalOpen(false)}
                  className="!py-3.5 !text-sm"
                >
                  Sudah Dibaca
                </StickerButton>
                <StickerButton
                  variant="secondary"
                  onClick={handleNextModal}
                  className="!w-12 !h-12 !p-0 !rounded-xl"
                >
                  <ChevronRight size={20} />
                </StickerButton>
              </div>
            </StickerCard>
          </motion.div>
        )}
      </AnimatePresence>
    </NgajiCeriaLayout>
  );
}
