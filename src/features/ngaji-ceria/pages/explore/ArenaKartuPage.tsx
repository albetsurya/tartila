import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import {
  ArrowLeft,
  ChevronRight,
  Play,
  Shuffle,
  Star,
  BookOpen,
  Check,
  X,
} from "../../../../components/ui"; // Impor dari barrel file
import { StickerButton, StickerCard } from "../../../../components/ui"; // Impor komponen stiker
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

// Mock data: 12 kartu hewan & huruf hijaiyah
const INITIAL_CARDS = [
  { id: 1, animal: "🐧", letter: "ا", latin: "Alif" },
  { id: 2, animal: "🐬", letter: "ب", latin: "Ba" },
  { id: 3, animal: "🦦", letter: "ت", latin: "Ta" },
  { id: 4, animal: "🐯", letter: "ث", latin: "Tsa" },
  { id: 5, animal: "🐸", letter: "ج", latin: "Jim" },
  { id: 6, animal: "🐨", letter: "ح", latin: "Ha" },
  { id: 7, animal: "🦁", letter: "خ", latin: "Kho" },
  { id: 8, animal: "🐵", letter: "د", latin: "Dal" },
  { id: 9, animal: "🦊", letter: "ذ", latin: "Dzal" },
  { id: 10, animal: "🐼", letter: "ر", latin: "Ra" },
  { id: 11, animal: "🐷", letter: "ز", latin: "Zai" },
  { id: 12, animal: "🐻", letter: "س", latin: "Sin" },
];

export default function ArenaKartuPage() {
  const navigate = useNavigate();
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Fungsi Acak Kartu
  const handleShuffle = () => {
    triggerBibiReaction("click");
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  };

  // Fungsi Buka Semua Kartu
  const handleOpenAll = () => {
    triggerBibiReaction("success");
    if (flipped.length === cards.length) {
      setFlipped([]);
    } else {
      setFlipped(cards.map((c) => c.id));
    }
  };

  // Fungsi Klik Kartu
  const handleCardClick = (id: number) => {
    triggerBibiReaction("click");
    if (flipped.includes(id)) {
      setFlipped(flipped.filter((fId) => fId !== id));
    } else {
      setFlipped([...flipped, id]);
    }
  };

  // Fungsi Buka Modal Uji Layar
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
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="min-h-full bg-[#F0FDF4] px-4 py-4 pb-32">
        {/* Header Info (Menggunakan StickerCard) */}
        <StickerCard className="mb-4 p-4 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF6B6B]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#FF6B6B] mb-2 border border-[#FF6B6B]/20">
            <BookOpen size={12} /> Papan Kartu Uji
          </span>
          <h2 className="font-display text-lg font-black text-[#134E4A]">
            Ketuk kartu untuk membuka tulisan Arab
          </h2>
          <p className="text-[11px] font-bold text-[#134E4A]/60 mt-1">
            Uji hafalan huruf hijaiyahmu bersama teman hewan!
          </p>
        </StickerCard>

        {/* Grid Kartu 3x4 */}
        <div className="grid grid-cols-3 gap-2.5">
          {cards.map((card) => {
            const isFlipped = flipped.includes(card.id);
            return (
              <motion.div
                key={card.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCardClick(card.id)}
                className={`relative aspect-[3/4] flex flex-col items-center justify-center rounded-2xl border-[3px] p-2 cursor-pointer transition-all ${
                  isFlipped
                    ? "bg-[#F0FDF4] border-[#FF6B6B] shadow-[2px_2px_0px_#FF6B6B]"
                    : "bg-white border-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
                }`}
              >
                <div className="absolute top-1.5 left-2 text-[9px] font-black text-[#134E4A]/40">
                  #{card.id.toString().padStart(2, "0")}
                </div>
                <div className="absolute top-1.5 right-2 text-[#FF6B6B]">
                  <Star size={10} fill="currentColor" />
                </div>

                {isFlipped ? (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    <span className="font-arabic text-4xl text-[#134E4A] leading-none mb-2">
                      {card.letter}
                    </span>
                    <span className="text-[9px] font-black text-[#FF6B6B] uppercase tracking-wider bg-[#FFF0F0] px-1.5 py-0.5 rounded border border-[#FF6B6B]/20">
                      {card.latin}
                    </span>
                    {/* Tombol Uji (Menggunakan StickerButton size sm) */}
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
                  <span className="text-4xl drop-shadow-md">{card.animal}</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Action Bar (Menggunakan StickerCard & StickerButton) */}
        <div className="fixed bottom-20 left-0 right-0 px-4 z-30">
          <StickerCard className="mx-auto max-w-md flex gap-2 p-2 shadow-[0_4px_0px_#134E4A]">
            <StickerButton
              variant="secondary"
              size="sm"
              fullWidth
              onClick={handleShuffle}
              className="!py-2.5"
            >
              <Shuffle size={14} /> Acak
            </StickerButton>
            <StickerButton
              variant="primary"
              size="sm"
              fullWidth
              onClick={handleOpenAll}
              className="!py-2.5"
            >
              <Play size={14} /> Buka
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
              <X size={14} /> Selesai
            </StickerButton>
          </StickerCard>
        </div>
      </div>

      {/* Modal Uji Layar (Menggunakan StickerCard & StickerButton) */}
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
              {/* Modal Header */}
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
                  <Check size={14} />
                </div>
              </div>

              {/* Kartu Arab Besar */}
              <div className="relative rounded-3xl border-[3px] border-[#134E4A] bg-[#F0FDF4] py-12 flex flex-col items-center justify-center shadow-[inset_0_-4px_0_rgba(19,78,74,0.1)]">
                <span className="font-arabic text-7xl text-[#134E4A] leading-none mb-4">
                  {currentCardData.letter}
                </span>
                <span className="text-sm font-black text-[#FF6B6B] tracking-widest uppercase">
                  {currentCardData.latin}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#FFF0F0] px-3 py-2 border-2 border-[#FF6B6B]/20 text-[10px] font-bold text-[#FF6B6B]">
                <Star size={12} fill="currentColor" /> Uji Membaca: Bacalah
                dengan suara jelas
              </div>

              {/* Navigasi Bawah */}
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
