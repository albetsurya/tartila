import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NgajiCeriaLayout } from '../../components/NgajiCeriaLayout';
import { ExploreHeader } from '../../components/ExploreHeader';
import { RHYTHM_MEMORY_LEVELS, RhythmMemoryLevel } from '../../data/rhythmMemoryData';
import { ChevronRight, Sparkles } from '@/components/ui/CustomIcons';
import { triggerBibiReaction } from '@/utils/bibiEvent';
import { soundManager } from '../../services/soundManager';

export default function RhythmMemorySelectPage() {
  const navigate = useNavigate();

  const handleSelectJilid = (level: RhythmMemoryLevel) => {
    triggerBibiReaction('play');
    soundManager.playSfx('pop');
    navigate(`/member/ngaji-ceria/rhythm-memory/${level.jilid}`);
  };

  return (
    <NgajiCeriaLayout
      title="Pilih Jilid Rhythm Memory"
      hideHeader={true}
      themeScope="lab-irama"
      onBack={() => navigate('/member/ngaji-ceria/training')}
    >
      <div className="relative min-h-[100dvh] w-full bg-[#042f2e] overflow-x-hidden pb-32 select-none">
        {/* Latar Belakang Panggung */}
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 25%, #10B981 0, transparent 65%)',
          }}
        />

        <div className="relative z-20">
          {/* Header Eksplorasi */}
          <ExploreHeader
            title="Tartila Rhythm Memory"
            subtitle="Asah ingatan kartu & ketuk irama nada Tilawati!"
            onBack={() => navigate('/member/ngaji-ceria/training')}
            themeScope="lab-irama"
            themeColorClass="bg-[#064e3b]"
            borderColorClass="border-[#34d399]"
            shadowClass="shadow-[0_4px_0px_#022c22]"
            textColorClass="text-[#fef3c7]"
            backClass="bg-[#fef3c7] text-[#064e3b] border-[#34d399] shadow-[2px_2px_0px_#022c22] hover:bg-[#fde68a]"
          />

          {/* Banner Hero Rhythm Memory */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl bg-[#fef3c7] border-[3px] border-[#34d399] p-4 sm:p-5 shadow-[4px_4px_0px_#022c22]">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-[#064e3b] border-2 border-[#34d399] text-3xl shadow-[2px_2px_0px_#022c22]">
                  🥁
                </div>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[#064e3b] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#a7f3d0] mb-1">
                    <Sparkles size={11} /> Game Baru: Memori & Ritme
                  </span>
                  <h1 className="font-display font-black text-lg sm:text-2xl text-[#064e3b] leading-tight">
                    Tartila Rhythm Memory
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[#042f2e]/85 leading-snug mt-0.5">
                    Buka kartu, dengarkan bacaan qari, dan ketuk tombol tepat sesuai ketukan irama untuk mencocokkan pasangannya!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Grid 6 Jilid Rhythm Memory */}
          <section className="px-4 pt-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {RHYTHM_MEMORY_LEVELS.map((level, idx) => (
                <motion.div
                  key={level.jilid}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectJilid(level)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#064e3b] border-[3px] border-[#34d399] p-4 shadow-[4px_4px_0px_#022c22] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_#022c22] active:translate-y-0.5 active:shadow-[1px_1px_0px_#022c22]"
                >
                  {/* Badge Tingkat Jilid */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black uppercase text-white shadow-xs ${level.badgeBg}`}
                    >
                      Jilid {level.jilid}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#a7f3d0]">
                      <span>Tempo:</span>
                      <span className="text-[#fde047]">{level.bpm} BPM</span>
                    </span>
                  </div>

                  <h3 className="font-display font-black text-base sm:text-lg text-[#fef3c7] leading-snug mb-1">
                    {level.subtitle}
                  </h3>
                  <p className="text-xs text-[#a7f3d0]/80 font-medium line-clamp-2 mb-4 leading-relaxed">
                    {level.desc}
                  </p>

                  {/* Tombol Aksi Mulai */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#10b981]/30">
                    <span className="text-[11px] font-bold text-[#fef3c7]">
                      12 Kartu Irama
                    </span>
                    <div className="inline-flex items-center gap-1 text-xs font-black text-[#fde047] group-hover:translate-x-1 transition-transform">
                      <span>Mulai Main</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
