import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NgajiCeriaLayout } from '../../../components/NgajiCeriaLayout';
import { ExploreHeader } from '../../../components/ExploreHeader';
import { ARENA_KARTU_DATA, ArenaKartuLevel } from '../../../data/arenaKartuData';
import {
  MEMORY_LEVELS_CONFIG,
  getMemoryLevelConfig,
} from '../../../data/tilawatiMemoryData';
import { useTilawatiMemoryStore } from '../../../hooks/useTilawatiMemoryStore';
import {
  ChevronRight,
  Sparkles,
  LockSvg,
  PlaySvg,
  XSvg,
  CheckSvg,
  StarSvg,
  GameCardSvg,
  ClockSvg,
  TargetSvg,
} from '@/components/ui/CustomIcons';
import { triggerBibiReaction } from '@/utils/bibiEvent';
import { soundManager } from '@/features/ngaji-ceria/services/soundManager';

export default function TilawatiMemorySelectPage() {
  const navigate = useNavigate();

  // State Bottom Sheet Start Screen
  const [selectedJilid, setSelectedJilid] = useState<ArenaKartuLevel | null>(null);
  const [chosenLevel, setChosenLevel] = useState<number>(1);

  const getUnlockedLevel = useTilawatiMemoryStore((s) => s.getUnlockedLevel);
  const levelRecords = useTilawatiMemoryStore((s) => s.levelRecords);

  const handleSelectJilid = (level: ArenaKartuLevel) => {
    triggerBibiReaction('click');
    soundManager.playSfx('pop');
    setSelectedJilid(level);

    // Ambil level tertinggi yang sudah terbuka untuk jilid ini
    const maxUnlocked = getUnlockedLevel(level.jilid);
    setChosenLevel(maxUnlocked);
  };

  const handleStartGame = () => {
    if (!selectedJilid) return;
    triggerBibiReaction('play');
    soundManager.playSfx('tap');
    navigate(`/member/ngaji-ceria/games/memory/${selectedJilid.jilid}/${chosenLevel}`);
  };

  const chosenConfig = getMemoryLevelConfig(chosenLevel);
  const maxUnlockedLevel = selectedJilid ? getUnlockedLevel(selectedJilid.jilid) : 1;

  return (
    <NgajiCeriaLayout
      title="Pilih Jilid Tilawati Memory"
      hideHeader={true}
      themeScope="arena-kartu"
      onBack={() => navigate('/member/ngaji-ceria/games')}
    >
      <div className="relative min-h-[100dvh] w-full bg-[#065F46] overflow-x-hidden pb-32 select-none">
        {/* Efek Lampu Panggung Felt Kasino */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 25%, #10B98133 0, transparent 65%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            boxShadow: 'inset 0 0 0 10px #B45309, inset 0 0 0 14px #78350F',
          }}
        />

        <div className="relative z-20">
          {/* Header Eksplorasi */}
          <ExploreHeader
            title="Tilawati Memory Match"
            subtitle="Asah ingatan visual mencocokkan huruf & kata Arab!"
            onBack={() => navigate('/member/ngaji-ceria/games')}
            themeScope="arena-kartu"
            themeColorClass="bg-[#065F46]"
            borderColorClass="border-[#B45309]"
            shadowClass="shadow-[0_4px_0px_#78350F]"
            textColorClass="text-[#FEF3C7]"
            backClass="bg-[#FEF3C7] text-[#7C2D12] border-[#B45309] shadow-[2px_2px_0px_#78350F] hover:bg-[#FDE68A]"
          />

          {/* Banner Hero */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-[#FEF3C7] border-[3px] border-[#B45309] p-4 sm:p-5 shadow-[4px_4px_0px_#78350F]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#065F46] border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                  <GameCardSvg size={28} stroke="#FEF3C7" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#B45309] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#FEF3C7] mb-1">
                    <Sparkles size={11} /> Time Attack Mode
                  </span>
                  <h1 className="font-display font-black text-lg sm:text-2xl text-[#7C2D12] leading-tight">
                    Tilawati Memory Match
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[#78350F]/90 leading-snug mt-0.5">
                    Pilih jilid dan selesaikan misi level sebelum waktu habis untuk membuka level berikutnya!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Grid 6 Jilid */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {ARENA_KARTU_DATA.map((level, idx) => {
                const maxLevel = getUnlockedLevel(level.jilid);

                return (
                  <motion.div
                    key={level.jilid}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleSelectJilid(level)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#042F2E]/90 border-[3px] border-[#B45309] p-4 shadow-[4px_4px_0px_#78350F] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_#78350F] active:translate-y-0.5 active:shadow-[1px_1px_0px_#78350F]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-black uppercase text-white shadow-xs ${level.badgeBg}`}
                      >
                        Jilid {level.jilid}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#FEF08A] text-[#78350F] border border-[#B45309]">
                        Level {maxLevel}/4 Terbuka
                      </span>
                    </div>

                    <h3 className="font-display font-black text-base sm:text-lg text-[#FEF3C7] leading-snug mb-1">
                      {level.subtitle}
                    </h3>
                    <p className="text-xs text-[#FEF3C7]/80 font-medium line-clamp-2 mb-4 leading-relaxed">
                      {level.desc}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#10B981]/30">
                      <span className="text-[11px] font-bold text-[#A7F3D0]">
                        4 Level Time Attack
                      </span>
                      <div className="inline-flex items-center gap-1 text-xs font-black text-[#FDE047] group-hover:translate-x-1 transition-transform">
                        <span>Pilih Level</span>
                        <ChevronRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {/* START SCREEN (BOTTOM SHEET / MODAL NEO-BRUTALISM) */}
      <AnimatePresence>
        {selectedJilid && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJilid(null)}
              className="absolute inset-0 bg-black/65 backdrop-blur-xs"
            />

            {/* Sheet Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="relative z-10 w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-[#FEF3C7] border-[4px] border-[#B45309] p-5 sm:p-6 shadow-[0_-8px_30px_rgba(0,0,0,0.4)] sm:shadow-[8px_8px_0px_#78350F] max-h-[92vh] overflow-y-auto"
            >
              {/* Header Sheet */}
              <div className="flex items-center justify-between border-b-2 border-[#B45309]/20 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#065F46] border-2 border-[#134E4A] flex items-center justify-center text-white shadow-xs">
                    <GameCardSvg size={20} stroke="#FEF3C7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#B45309] tracking-wider">
                      Misi Time Attack
                    </span>
                    <h2 className="font-display font-black text-lg sm:text-xl text-[#78350F]">
                      Memory Match - Jilid {selectedJilid.jilid}
                    </h2>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJilid(null)}
                  className="w-8 h-8 rounded-full bg-white/80 border-2 border-[#B45309] text-[#78350F] flex items-center justify-center font-black active:scale-90 transition-transform cursor-pointer"
                  aria-label="Tutup"
                >
                  <XSvg size={14} />
                </button>
              </div>

              {/* Deskripsi Misi */}
              <p className="text-xs font-bold text-[#78350F]/85 leading-relaxed mb-4">
                Temukan semua pasangan kartu sebelum waktu habis! Selesaikan level untuk membuka tantangan berikutnya.
              </p>

              {/* Pilihan Level (4 Tombol) */}
              <div className="space-y-2 mb-4">
                <span className="block text-xs font-black text-[#78350F] uppercase tracking-wider">
                  Pilih Tingkat Kesulitan:
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {MEMORY_LEVELS_CONFIG.map((lvl) => {
                    const isUnlocked = lvl.level <= maxUnlockedLevel;
                    const isSelected = chosenLevel === lvl.level;
                    const recordKey = `${selectedJilid.jilid}-${lvl.level}`;
                    const record = levelRecords[recordKey];

                    return (
                      <button
                        key={lvl.level}
                        type="button"
                        disabled={!isUnlocked}
                        onClick={() => {
                          setChosenLevel(lvl.level);
                          soundManager.playSfx('tap');
                        }}
                        className={`relative p-3 rounded-2xl border-[3px] text-left transition-all flex flex-col justify-between min-h-[90px] select-none ${
                          !isUnlocked
                            ? 'bg-gray-200/90 border-gray-400/80 text-gray-500 cursor-not-allowed opacity-60 shadow-none'
                            : isSelected
                            ? 'bg-[#10B981] text-white border-[#065F46] shadow-[3px_3px_0px_#065F46] scale-[1.02] ring-3 ring-[#34D399] cursor-pointer'
                            : 'bg-white text-[#78350F] border-[#B45309] hover:bg-[#FEF08A] shadow-[2px_2px_0px_#78350F] cursor-pointer active:translate-y-0.5 active:shadow-none'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-display font-black text-xs sm:text-sm">
                            Level {lvl.level}
                          </span>
                          {!isUnlocked ? (
                            <span className="flex items-center gap-1 text-[10px] font-black text-gray-500 bg-gray-300 px-1.5 py-0.5 rounded-md">
                              <LockSvg size={11} /> Kunci
                            </span>
                          ) : (
                            <div className="flex items-center gap-0.5 text-[11px] text-[#FDE047]">
                              {record?.stars ? (
                                Array.from({ length: record.stars }).map((_, sIdx) => (
                                  <StarSvg key={sIdx} size={12} fill="#FDE047" stroke="#78350F" />
                                ))
                              ) : (
                                <span
                                  className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                                    isSelected
                                      ? 'bg-white/20 text-white'
                                      : 'bg-[#FEF08A] text-[#78350F]'
                                  }`}
                                >
                                  Terbuka
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 space-y-0.5">
                            <p
                              className={`text-[11px] font-black ${
                                isSelected ? 'text-white' : 'text-[#78350F]'
                              }`}
                            >
                              <GameCardSvg size={14} stroke="#065F46" /> {lvl.pairsCount} Pasang ({lvl.cardsCount} Kartu)
                            </p>
                            <p
                              className={`text-[10px] font-bold ${
                                isSelected ? 'text-[#ECFDF5]' : 'text-[#78350F]/70'
                              }`}
                            >
                              <ClockSvg size={11} stroke="#ECFDF5" /> Batas Waktu: {lvl.timeLimitSeconds}s
                            </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Box Rangkuman Misi Level Terpilih */}
              <div className="p-3.5 rounded-2xl bg-[#065F46] border-2 border-[#134E4A] text-[#FEF3C7] shadow-inner mb-5">
                <div className="flex items-center justify-between text-xs font-black mb-1">
                  <span className="text-[#FDE047] flex items-center gap-1">
                    <TargetSvg size={13} stroke="#FDE047" /> Target Level {chosenLevel}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#A7F3D0]">
                    Jilid {selectedJilid.jilid}
                  </span>
                </div>
                <p className="text-xs font-semibold leading-relaxed">
                  Cocokkan <strong>{chosenConfig.pairsCount} pasang kartu ({chosenConfig.cardsCount} kartu)</strong> sebelum waktu <strong>{chosenConfig.timeLimitSeconds} detik</strong> habis. Sisa waktu lebih banyak memberikan bintang lebih tinggi!
                </p>
              </div>

              {/* Tombol Mulai Bermain */}
              <button
                type="button"
                onClick={handleStartGame}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-display font-black text-base border-[3px] border-[#042F2E] shadow-[4px_4px_0px_#042F2E] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PlaySvg size={18} />
                <span>Mulai Level {chosenLevel} Sekarang</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </NgajiCeriaLayout>
  );
}
