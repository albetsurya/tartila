import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NgajiCeriaLayout } from '../components/NgajiCeriaLayout';
import { LabIramaTabNav } from '../components/lab-irama/LabIramaTabNav';
import { ModulMetronomeGuide } from '../components/lab-irama/ModulMetronomeGuide';
import { ModulEarTraining } from '../components/lab-irama/ModulEarTraining';
import { ModulTapTheBeat } from '../components/lab-irama/ModulTapTheBeat';
import { useLabIramaStore } from '../hooks/useLabIramaStore';
import { preloadLabIramaAudio } from '../hooks/useLabIramaMetronome';
import { SparklesSvg, FireSvg, StarSvg, ChevronLeftSvg } from '../../../components/ui/CustomIcons';
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
            <span className="text-sm">🎵</span>
          </span>
        }
        subtitle="Latihan Nada Rost & Ketukan Tilawati"
        onBack={handleBack}
        themeScope="lab-irama"
        themeColorClass="bg-[#111827]"
        borderColorClass="border-[#F59E0B]"
        shadowClass="shadow-[0_4px_0px_#78350F]"
        textColorClass="text-white"
        backClass="bg-[#FDE047] text-[#111827] border-[#111827] shadow-[2px_2px_0px_#111827] hover:bg-[#FACC15]"
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

      <div className="max-w-md mx-auto w-full px-4 py-4 space-y-4 pb-32">
        {/* 1. Hero Banner Arcade Neon Emas */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1F2937] to-[#111827] border-[3px] border-[var(--border-color,#F59E0B)] p-4 text-white shadow-[4px_4px_0px_var(--shadow-color,#F59E0B)]">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-14 h-14 shrink-0 rounded-2xl bg-[#F59E0B]/20 border-2 border-[#F59E0B]/50 flex items-center justify-center text-3xl shadow-sm rotate-3">
              🥁
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F59E0B] text-[#111827] text-[10px] font-black uppercase tracking-wider mb-1 shadow-xs">
                <SparklesSvg size={12} /> Fitur Mandiri
              </div>
              <h1 className="font-display font-black text-xl leading-tight text-[#F8FAFC]">
                Lab Irama & Ketukan
              </h1>
              <p className="text-[11px] text-amber-200/90 font-bold leading-tight mt-0.5">
                Latih kepekaan lagu Rost & ketukan mad Tilawati tanpa rekaman.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Mini Rekor Badges */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--bg-card,#1F2937)] border-2 border-[var(--border-color,#F59E0B)] rounded-2xl p-2.5 shadow-[2px_2px_0px_var(--shadow-color,#F59E0B)] flex items-center gap-2">
            <span className="text-xl">👂</span>
            <div>
              <span className="text-[9px] font-black uppercase text-amber-300/80">Rekor Tebak</span>
              <p className="font-display font-black text-sm text-[var(--text-main,#F8FAFC)]">
                {bestEarScore > 0 ? `${bestEarScore} Poin` : 'Belum Ada'}
              </p>
            </div>
          </div>

          <div className="bg-[var(--bg-card,#1F2937)] border-2 border-[var(--border-color,#F59E0B)] rounded-2xl p-2.5 shadow-[2px_2px_0px_var(--shadow-color,#F59E0B)] flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <span className="text-[9px] font-black uppercase text-amber-300/80">Rekor Ketuk</span>
              <p className="font-display font-black text-sm text-[var(--text-main,#F8FAFC)]">
                {bestTapScore > 0 ? `${bestTapScore} (${tapMaxCombo}x 🔥)` : 'Belum Ada'}
              </p>
            </div>
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
