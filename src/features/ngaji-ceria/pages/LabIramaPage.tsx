import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NgajiCeriaLayout } from '../components/NgajiCeriaLayout';
import { LabIramaTabNav } from '../components/lab-irama/LabIramaTabNav';
import { PatternArrow } from '../components/lab-irama/PatternArrow';
import { ModulMetronomeGuide } from '../components/lab-irama/ModulMetronomeGuide';
import { ModulEarTraining } from '../components/lab-irama/ModulEarTraining';
import { ModulTapTheBeat } from '../components/lab-irama/ModulTapTheBeat';
import { useLabIramaStore } from '../hooks/useLabIramaStore';
import { preloadLabIramaAudio } from '../hooks/useLabIramaMetronome';
import { SparklesSvg, FireSvg, StarSvg, ChevronLeftSvg, MusicSvg, DrumSvg, EarSvg, ZapSvg } from '../../../components/ui/CustomIcons';
import { ExploreHeader, ExploreStatBadge } from '../components/ExploreHeader';

export default function LabIramaPage() {
  const navigate = useNavigate();
  const activeTab = useLabIramaStore((s) => s.activeTab);
  const setActiveTab = useLabIramaStore((s) => s.setActiveTab);
  const bestEarScore = useLabIramaStore((s) => s.bestEarScore);
  const bestTapScore = useLabIramaStore((s) => s.bestTapScore);
  const tapMaxCombo = useLabIramaStore((s) => s.tapMaxCombo);
  const highestScore = Math.max(bestEarScore, bestTapScore);

  // Pre-load audio context saat masuk ke halaman (requirement #2)
  useEffect(() => {
    void preloadLabIramaAudio();
  }, []);

  const handleBack = () => {
    navigate('/member/ngaji-ceria/training');
  };

  return (
    <NgajiCeriaLayout
      title="Lab Irama"
      hideHeader={true}
      themeScope="lab-irama"
      showBack
      onBack={handleBack}
      hideNav={false}
    >
      {/* Header Terstandarisasi Lab Irama [Hati] [Koin] [Skor Tertinggi] */}
      <ExploreHeader
        title={
          <span className="flex items-center gap-1.5 font-display font-black text-base sm:text-lg text-white leading-tight">
            <span>Lab Irama</span>
            <span className="text-sm inline-flex items-center [--svg-primary:#FFFFFF]"><MusicSvg size={14} /></span>
          </span>
        }
        subtitle="Latihan Nada Rost & Ketukan Tilawati"
        onBack={handleBack}
        themeScope="lab-irama"
        themeColorClass="bg-[#0D9488]"
        borderColorClass="border-[#134E4A]"
        shadowClass="shadow-[0_4px_0px_#134E4A]"
        textColorClass="text-white"
        backClass="bg-white text-[#134E4A] border-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#E0F2FE]"
        backContent={<ChevronLeftSvg size={20} stroke="#000000" className="text-black shrink-0" />}
        extraBadge={
          highestScore > 0 ? (
            <ExploreStatBadge
              icon={<StarSvg size={18} fill="#FDE047" stroke="currentColor" className="shrink-0" />}
              value={highestScore}
              title={`Skor Tertinggi: ${highestScore}`}
            />
          ) : undefined
        }
      />

      <div className="max-w-md mx-auto w-full px-4 py-4 space-y-4 pb-32 bg-[#F0FDF4]">
        {/* 1. Hero Banner Neo-Brutalism Terang */}
        <section className="relative overflow-hidden rounded-3xl bg-white border-[3px] border-[#134E4A] p-4 text-[#134E4A] shadow-[4px_4px_0px_#134E4A]">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#FEF08A] border-[3px] border-[#134E4A] flex items-center justify-center shadow-[3px_3px_0px_#134E4A] rotate-3 [--svg-primary:#134E4A]">
              <DrumSvg size={32} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0D9488] text-white text-[10px] font-black uppercase tracking-wider mb-1 border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A]">
                <SparklesSvg size={12} /> Fitur Mandiri
              </div>
              <h1 className="font-display font-black text-xl leading-tight text-[#134E4A]">
                Lab Irama & Ketukan
              </h1>
              <p className="text-[11px] text-[#134E4A]/70 font-bold leading-tight mt-0.5">
                Latih kepekaan lagu Rost & ketukan mad Tilawati tanpa rekaman.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Mini Rekor Badges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white border-[3px] border-[#134E4A] rounded-2xl p-2.5 shadow-[4px_4px_0px_#134E4A] flex items-center gap-2 [--svg-primary:#0D9488]">
            <EarSvg size={22} />
            <div>
              <span className="text-[9px] font-black uppercase text-[#0D9488]">Rekor Tebak</span>
              <p className="font-display font-black text-sm text-[#134E4A]">
                {bestEarScore > 0 ? `${bestEarScore} Poin` : 'Belum Ada'}
              </p>
            </div>
          </div>

          <div className="bg-white border-[3px] border-[#134E4A] rounded-2xl p-2.5 shadow-[4px_4px_0px_#134E4A] flex items-center gap-2 [--svg-primary:#0D9488]">
            <ZapSvg size={22} />
            <div>
              <span className="text-[9px] font-black uppercase text-[#0D9488]">Rekor Ketuk</span>
              <p className="font-display font-black text-sm text-[#134E4A]">
                {bestTapScore > 0 ? `${bestTapScore} (${tapMaxCombo}x <FireSvg size={14} className="inline-block" />)` : 'Belum Ada'}
              </p>
            </div>
          </div>
        </div>

        {/* 2b. Visual Pola Nada (PatternArrow) */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-white border-[3px] border-[#134E4A] rounded-2xl shadow-[4px_4px_0px_#134E4A]">
           <div className="text-center">
             <div className="flex justify-center">
               <PatternArrow type="1-datar" />
             </div>
             <p className="text-xs font-bold mt-2 text-[#134E4A]">1 Nada</p>
           </div>
           <div className="text-center">
             <div className="flex justify-center">
               <PatternArrow type="2-datar-turun" />
             </div>
             <p className="text-xs font-bold mt-2 text-[#134E4A]">2 Nada</p>
           </div>
           <div className="text-center">
             <div className="flex justify-center">
               <PatternArrow type="3-datar-naik-turun" />
             </div>
             <p className="text-xs font-bold mt-2 text-[#134E4A]">3 Nada</p>
           </div>
           <div className="text-center">
             <div className="flex justify-center">
               <PatternArrow type="4-datar-naik-naik-turun" />
             </div>
             <p className="text-xs font-bold mt-2 text-[#134E4A]">4 Nada</p>
           </div>
        </div>

        {/* 3. Segmented Tab Navigation */}
        <LabIramaTabNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* 4. Konten Modul Aktif */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'guide' && <ModulMetronomeGuide />}
            {activeTab === 'ear-training' && <ModulEarTraining />}
            {activeTab === 'tap-beat' && <ModulTapTheBeat />}
          </motion.div>
        </AnimatePresence>
      </div>
    </NgajiCeriaLayout>
  );
}
