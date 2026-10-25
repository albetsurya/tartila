import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NgajiCeriaLayout } from '../../components/NgajiCeriaLayout';
import { ExploreHeader } from '../../components/ExploreHeader';
import { ChevronRight, Sparkles } from '@/components/ui/CustomIcons';
import { triggerBibiReaction } from '@/utils/bibiEvent';
import { soundManager } from '../../services/soundManager';

interface TrainingProgram {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeBg: string;
  icon: string;
  to: string;
  themeBg: string;
  borderColor: string;
  textColor: string;
  isFeatured?: boolean;
}

const TRAINING_PROGRAMS: TrainingProgram[] = [
  {
    id: 'rhythm-memory',
    title: 'Tartila Rhythm Memory',
    subtitle: 'Memori Kartu + Ketukan Irama',
    description:
      'Gabungan asah otak visual dan ketukan irama tilawati! Balik kartu, dengarkan bacaan qari, dan ketuk tombol tepat sesuai ketukan nada untuk membuka pasangannya.',
    badge: '🎮 Game Baru',
    badgeBg: 'bg-[#059669]',
    icon: '🥁',
    to: '/member/ngaji-ceria/rhythm-memory',
    themeBg: 'bg-[#ecfdf5]',
    borderColor: 'border-[#10b981]',
    textColor: 'text-[#064e3b]',
    isFeatured: true,
  },
  {
    id: 'lab-irama',
    title: 'Lab Irama Tilawati',
    subtitle: 'Latihan Mandiri Nada & Ketukan',
    description:
      'Latih kepekaan telingamu membedakan 3 nada Rost Tilawati (Datar, Naik, Turun) dan latih ketukan panjang-pendek dengan metronom visual.',
    badge: '🎵 Audio & Beat',
    badgeBg: 'bg-[#9333ea]',
    icon: '🎼',
    to: '/member/ngaji-ceria/lab-irama',
    themeBg: 'bg-[#faf5ff]',
    borderColor: 'border-[#a855f7]',
    textColor: 'text-[#581c87]',
  },
  {
    id: 'arena-kartu',
    title: 'Arena Kartu Klasik',
    subtitle: 'Asah Ingatan Visual Tilawati',
    description:
      'Uji ketangkasan memori mencocokkan huruf tunggal, kata 3 huruf, hingga potongan ayat suci Al-Qur’an di meja felt kasino santri yang asyik.',
    badge: '🃏 Memori Cepat',
    badgeBg: 'bg-[#b45309]',
    icon: '🃏',
    to: '/member/ngaji-ceria/arena-kartu',
    themeBg: 'bg-[#fefce8]',
    borderColor: 'border-[#eab308]',
    textColor: 'text-[#713f12]',
  },
];

export default function TilawatiTrainingPage() {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    triggerBibiReaction('click');
    soundManager.playSfx('pop');
    navigate(to);
  };

  return (
    <NgajiCeriaLayout
      title="Pusat Latihan Tilawati"
      hideHeader={true}
      themeScope="tilawati"
      onBack={() => navigate('/member/ngaji-ceria/map')}
    >
      <div className="relative min-h-[100dvh] w-full bg-[#f8fafc] overflow-x-hidden pb-36 select-none">
        {/* Latar Belakang */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 15%, #0284c715 0, transparent 65%)',
          }}
        />

        <div className="relative z-20">
          {/* Header Eksplorasi */}
          <ExploreHeader
            title="Pusat Latihan"
            subtitle="Latihan mandiri nada Rost, ketukan, & memori Tilawati"
            onBack={() => navigate('/member/ngaji-ceria/map')}
            themeScope="tilawati"
            themeColorClass="bg-[#0284c7]"
            borderColorClass="border-[#0369a1]"
            shadowClass="shadow-[0_4px_0px_#075985]"
            textColorClass="text-white"
            backClass="bg-white text-[#0369a1] border-[#0369a1] shadow-[2px_2px_0px_#075985] hover:bg-sky-50"
          />

          {/* Banner Hero */}
          <section className="px-4 pt-6 max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0284c7] to-[#0369a1] border-[3.5px] border-[#075985] p-5 sm:p-6 shadow-[5px_5px_0px_#075985] text-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-4xl shadow-inner shrink-0">
                  🎯
                </div>
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-white/25 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white mb-1.5 backdrop-blur-xs">
                    <Sparkles size={11} /> Mandiri & Multisensori
                  </span>
                  <h1 className="font-display font-black text-xl sm:text-2xl leading-tight">
                    Pusat Latihan Santri Tartila
                  </h1>
                  <p className="text-xs sm:text-sm font-medium text-sky-100 mt-1 leading-snug">
                    Pilih metode latihan favoritmu untuk memperkuat pendengaran irama, ketukan mad, dan ingatan huruf tanpa takut salah.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Daftar 3 Program Latihan */}
          <section className="px-4 pt-6 max-w-3xl mx-auto">
            <div className="flex flex-col gap-4">
              {TRAINING_PROGRAMS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  onClick={() => handleNavigate(item.to)}
                  className={`group relative cursor-pointer overflow-hidden rounded-3xl border-[3.5px] p-5 shadow-[5px_5px_0px_#0f172a] transition-all hover:-translate-y-1 hover:shadow-[7px_7px_0px_#0f172a] active:translate-y-0.5 active:shadow-[2px_2px_0px_#0f172a] ${item.themeBg} ${item.borderColor}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Ikon Program */}
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-900/20 flex items-center justify-center text-3xl shadow-sm shrink-0">
                      {item.icon}
                    </div>

                    {/* Deskripsi */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black text-white uppercase tracking-wider ${item.badgeBg}`}
                        >
                          {item.badge}
                        </span>
                        {item.isFeatured && (
                          <span className="text-[10px] font-black text-amber-600 uppercase">
                            ★ REKOMENDASI
                          </span>
                        )}
                      </div>

                      <h2
                        className={`font-display font-black text-lg sm:text-xl leading-snug ${item.textColor}`}
                      >
                        {item.title}
                      </h2>
                      <span className="block text-xs font-bold text-slate-500 mb-2">
                        {item.subtitle}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                        {item.description}
                      </p>

                      {/* Tombol Masuk */}
                      <div className="mt-4 pt-3 border-t border-slate-900/10 flex items-center justify-between">
                        <span className="text-xs font-black text-slate-600">
                          Mulai Latihan
                        </span>
                        <div className="inline-flex items-center gap-1 text-xs font-black text-sky-700 group-hover:translate-x-1.5 transition-transform">
                          <span>Buka Menu</span>
                          <ChevronRight size={14} />
                        </div>
                      </div>
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
