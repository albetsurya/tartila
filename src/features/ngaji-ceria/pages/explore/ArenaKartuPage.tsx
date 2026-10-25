import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NgajiCeriaLayout } from '../../components/NgajiCeriaLayout';
import { ExploreHeader, ExploreStatBadge } from '../../components/ExploreHeader';
import {
  ARENA_KARTU_DATA,
  getArenaKartuMateri,
  getArabicFontSizeClass,
  ArenaKartuMateri,
} from '../../data/arenaKartuData';
import { useEconomyStore } from '../../hooks/useEconomyStore';
import {
  StarSvg,
  CheckSvg,
  ChevronRight,
  BookOpen,
} from '@/components/ui/CustomIcons';
import { triggerBibiReaction } from '@/utils/bibiEvent';
import { soundManager } from '@/features/ngaji-ceria/services/soundManager';

export default function ArenaKartuPage() {
  const navigate = useNavigate();
  const { jilid: jilidParam } = useParams<{ jilid?: string }>();

  // Ambil jilid dari URL (default 1 jika tidak ada / tidak valid)
  const currentJilid = useMemo(() => {
    const parsed = Number(jilidParam);
    return parsed >= 1 && parsed <= 6 ? parsed : 1;
  }, [jilidParam]);

  const levelInfo = useMemo(() => {
    return (
      ARENA_KARTU_DATA.find((l) => l.jilid === currentJilid) ||
      ARENA_KARTU_DATA[0]
    );
  }, [currentJilid]);

  // 12 Kartu Materi untuk jilid ini
  const cards = useMemo(() => {
    return getArenaKartuMateri(currentJilid);
  }, [currentJilid]);

  // State Progres dari Zustand Store & LocalStorage
  const completedArenaCards = useEconomyStore((s) => s.completedArenaCards);
  const completedList = useMemo(() => {
    return completedArenaCards?.[currentJilid] || [];
  }, [completedArenaCards, currentJilid]);

  const completedCount = useMemo(() => {
    return cards.filter((c) => completedList.includes(c.id)).length;
  }, [cards, completedList]);

  const progressPercent = Math.round((completedCount / cards.length) * 100);

  // Handler Klik Kartu -> Navigasi ke Halaman Latihan
  const handleCardClick = (card: ArenaKartuMateri) => {
    triggerBibiReaction('click');
    soundManager.playSfx('pop');
    navigate(`/member/ngaji-ceria/arena-kartu/${currentJilid}/practice/${card.id}`);
  };

  return (
    <NgajiCeriaLayout
      title={`Papan Progres Arena Kartu - Jilid ${currentJilid}`}
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate('/member/ngaji-ceria/training')}
    >
      {/* Background Meja Kasino Felt Hijau */}
      <div className="relative min-h-[100dvh] w-full bg-[#065F46] overflow-x-hidden pb-44 sm:pb-48 select-none">
        {/* Efek Meja Felt & Lampu Panggung */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 30%, #10B98122 0, transparent 65%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            boxShadow: 'inset 0 0 0 10px #B45309, inset 0 0 0 14px #78350F',
          }}
        />

        <div className="relative z-20">
          {/* Header Terstandarisasi dengan Tombol Ganti Jilid */}
          <ExploreHeader
            title={`Papan Progres: Jilid ${currentJilid}`}
            subtitle={levelInfo.subtitle}
            onBack={() => navigate('/member/ngaji-ceria/training')}
            themeScope="arena-kartu"
            themeColorClass="bg-[#065F46]"
            borderColorClass="border-[#B45309]"
            shadowClass="shadow-[0_4px_0px_#78350F]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#7C2D12] border-[#B45309] shadow-[2px_2px_0px_#78350F] hover:bg-[#FDE68A]"
            extraBadge={
              <ExploreStatBadge
                icon={<StarSvg size={18} fill="#FDE047" className="shrink-0" />}
                value={`${completedCount}/12`}
                title={`Progres: ${completedCount} dari 12 Kartu`}
                className="bg-[#FEF3C7] text-[#7C2D12] border-[#B45309] shadow-[2px_2px_0px_#78350F]"
              />
            }
            rightAction={
              <button
                type="button"
                onClick={() => navigate('/member/ngaji-ceria/arena-kartu')}
                className="inline-flex items-center gap-1 rounded-xl border-2 border-[#B45309] bg-[#FEF3C7] px-2.5 py-1 text-xs font-black text-[#7C2D12] shadow-[2px_2px_0px_#78350F] active:translate-y-[1px] hover:bg-[#FDE68A] transition-all cursor-pointer shrink-0"
              >
                <span>Ganti Jilid</span>
                <ChevronRight size={12} />
              </button>
            }
          />

          {/* PROGRESS COUNTER & BANNER PERINGKAT (NEO-BRUTALISM) */}
          <section className="px-4 pt-4 max-w-4xl mx-auto">
            <div className="rounded-2xl bg-[#042F2E]/90 border-[3px] border-[#10B981]/50 p-3.5 sm:p-4 text-[#FEF3C7] shadow-[4px_4px_0px_#022C22]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  <div>
                    <h2 className="text-xs sm:text-sm font-black text-white">
                      Progres Materi Jilid {currentJilid}
                    </h2>
                    <span className="text-[10px] text-[#A7F3D0] font-medium">
                      Buka kartu dan latih ketukan irama tilawati untuk menguasainya!
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black text-[#FDE047]">
                    {completedCount} / 12 Kartu
                  </span>
                  <span className="block text-[10px] font-bold text-[#A7F3D0]">
                    ({progressPercent}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar Visual */}
              <div className="h-3 w-full rounded-full bg-[#022C22] border-2 border-[#10B981]/60 overflow-hidden p-0.5">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#FDE047] via-[#10B981] to-[#34D399]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          </section>

          {/* GRID 12 KARTU PAPAN PROGRES (3 KOLOM X 4 BARIS) */}
          <section className="px-4 pt-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {cards.map((card, index) => {
                const isCompleted = completedList.includes(card.id);

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: index * 0.03,
                      type: 'spring',
                      stiffness: 280,
                      damping: 22,
                    }}
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleCardClick(card)}
                    className={`relative cursor-pointer overflow-hidden rounded-2xl border-[3.5px] p-3 text-center transition-all select-none flex flex-col justify-between aspect-[3/4] ${
                      isCompleted
                        ? 'bg-[#F0FDF4] border-[#10B981] shadow-[4px_4px_0px_#065F46] hover:shadow-[6px_6px_0px_#065F46]'
                        : 'bg-[#0D9488] border-[#134E4A] shadow-[4px_4px_0px_#134E4A] hover:shadow-[6px_6px_0px_#134E4A]'
                    }`}
                  >
                    {/* Header Mini Kartu */}
                    <div className="w-full flex items-center justify-between z-10">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider ${
                          isCompleted ? 'text-[#10B981]' : 'text-[#FEF08A]/90'
                        }`}
                      >
                        #{String(card.cardIndex).padStart(2, '0')}
                      </span>

                      {isCompleted ? (
                        <span className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center text-[10px] font-black shadow-xs">
                          <CheckSvg size={12} />
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-[#042F2E]/60 border border-[#FEF08A]/40 text-[#FEF08A] flex items-center justify-center text-[10px] font-black shadow-xs">
                          🔒
                        </span>
                      )}
                    </div>

                    {/* KONTEN KARTU: TERBUKA (TEKS ARAB) VS TERTUTUP (GEMBOK/TANDA TANYA) */}
                    {isCompleted ? (
                      /* KARTU TERBUKA (SUDAH DIKUASAI) */
                      <div className="flex-1 flex flex-col items-center justify-center my-1">
                        <div
                          className="flex items-center justify-center w-full my-auto"
                          dir="rtl"
                        >
                          <span
                            className={`font-arabic font-bold text-[#065F46] leading-loose drop-shadow-xs max-w-full break-words select-none ${getArabicFontSizeClass(
                              card.text
                            )}`}
                          >
                            {card.text}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#047857] line-clamp-1">
                          {card.transliteration}
                        </span>
                      </div>
                    ) : (
                      /* KARTU TERTUTUP (BELUM DIKUASAI) */
                      <div className="flex-1 flex flex-col items-center justify-center my-auto">
                        <div className="w-12 h-12 rounded-2xl bg-[#042F2E]/50 border-2 border-[#FEF08A]/60 flex items-center justify-center rotate-45 shadow-xs mb-2">
                          <div className="-rotate-45 text-xl text-[#FDE047]">
                            ❓
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#FEF08A]/80">
                          Terkunci
                        </span>
                      </div>
                    )}

                    {/* Footer Kartu Mini Action */}
                    <div className="w-full pt-1.5 border-t border-black/10">
                      <div
                        className={`inline-flex items-center justify-center gap-1 w-full py-1 rounded-lg text-[9px] font-black uppercase transition-colors ${
                          isCompleted
                            ? 'bg-[#DCFCE7] text-[#15803D]'
                            : 'bg-[#FEF08A] text-[#78350F]'
                        }`}
                      >
                        <span>{isCompleted ? 'Latih Lagi' : 'Buka & Latih'}</span>
                        <ChevronRight size={10} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* BOTTOM BAR AKSI PAPAN PROGRES */}
          <div className="fixed bottom-20 sm:bottom-24 left-0 right-0 z-50 px-4 pointer-events-none">
            <div className="mx-auto max-w-md pointer-events-auto">
              <div className="flex items-center gap-2 rounded-2xl bg-[#1E1B4B] border-[3px] border-[#FDE68A] p-2.5 shadow-[0_5px_0px_#0F172A]">
                {/* 1. Tombol Kembali ke Pusat Latihan */}
                <button
                  type="button"
                  onClick={() => navigate('/member/ngaji-ceria/training')}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#78350F] bg-[#FEF08A] hover:bg-[#FDE047] active:translate-y-[1px] active:shadow-none px-3 py-2.5 text-xs font-black text-[#78350F] shadow-[2px_2px_0px_#78350F] transition-all cursor-pointer select-none"
                >
                  <BookOpen size={15} />
                  <span>Pusat Latihan</span>
                </button>

                {/* 2. Tombol Ganti Jilid */}
                <button
                  type="button"
                  onClick={() => navigate('/member/ngaji-ceria/arena-kartu')}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#042F2E] bg-[#10B981] hover:bg-[#059669] active:translate-y-[1px] active:shadow-none px-3 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_#042F2E] transition-all cursor-pointer select-none"
                >
                  <span>Ganti Jilid</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
