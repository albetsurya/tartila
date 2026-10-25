import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftSvg,
  CoinSvg,
  GraduationCapSvg,
  CardsSvg,
  TilawatiSvg,
  QuranSvg,
  HandsPrayingSvg,
  PencilSvg,
  SwordsSvg,
  WhatsAppSvg,
  CopySvg,
  CheckSvg,
  XSvg,
  RefreshCwSvg,
  SparklesSvg,
} from "@/components/ui/CustomIcons";
import { useEconomyStore } from "../hooks/useEconomyStore";
import { useAuth } from "@/contexts/AuthContext";
import {
  QUIZ_HUB_CATEGORIES,
  QuizHubCategory,
} from "../data/quizHubData";

export default function QuizHubPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const coins = useEconomyStore((s) => s.coins);

  // State untuk Bottom Sheet Tantang Teman
  const [isChallengeSheetOpen, setIsChallengeSheetOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<QuizHubCategory>("bahasa-arab");
  const [seed, setSeed] = useState(() => Math.floor(10000 + Math.random() * 90000));
  const [isCopied, setIsCopied] = useState(false);

  const handleRandomizeSeed = () => {
    setSeed(Math.floor(10000 + Math.random() * 90000));
    setIsCopied(false);
  };

  const challengerId = user?.username || user?.name || user?.id || "santri";
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/quiz-hub/versus?seed=${seed}&category=${selectedCategory}&challenger=${encodeURIComponent(challengerId)}`
    : `https://tartila.com/quiz-hub/versus?seed=${seed}&category=${selectedCategory}&challenger=${encodeURIComponent(challengerId)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      // Fallback
      setIsCopied(true);
    }
  };

  const handleShareWhatsApp = () => {
    const categoryInfo = QUIZ_HUB_CATEGORIES.find((c) => c.id === selectedCategory);
    const catName = categoryInfo ? categoryInfo.title : "Kuis";
    const message = `Bismillah! Aku menantangmu di Pusat Kuis Tartila (Kategori: ${catName}). Ayo buktikan kemampuanmu!\n\nMainkan soal yang sama di tautan berikut:\n${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
  };

  const getCategoryIcon = (catId: QuizHubCategory) => {
    switch (catId) {
      case "tilawati":
        return <TilawatiSvg size={28} />;
      case "juz-amma":
        return <QuranSvg size={28} />;
      case "kisah-doa":
        return <HandsPrayingSvg size={28} />;
      case "bahasa-arab":
        return <PencilSvg size={28} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#0F172A] pb-24 font-sans selection:bg-[#FDE047]">
      {/* 1. Header Neo-Brutalism */}
      <header className="sticky top-0 z-30 bg-[#FEF08A] border-b-4 border-[#0F172A] px-4 py-3.5 shadow-[0_4px_0_#0F172A]">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/member/ngaji-ceria/games")}
              className="w-10 h-10 rounded-xl bg-white border-3 border-[#0F172A] shadow-[2px_2px_0_#0F172A] flex items-center justify-center hover:bg-slate-100 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              title="Kembali ke Games"
            >
              <ArrowLeftSvg size={20} />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                Pusat Kuis
              </h1>
              <p className="text-xs font-bold text-slate-700">Quiz Hub & Latihan Soal</p>
            </div>
          </div>

          {/* Badge Koin */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border-2 border-[#0F172A] shadow-[2px_2px_0_#0F172A]">
            <CoinSvg size={18} />
            <span className="text-xs sm:text-sm font-black text-amber-900">{coins}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 pt-5 pb-8 space-y-6">
        {/* 2. Dua Tombol Mode Utama di Atas */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Latihan Soal (Pilihan Ganda & Rumpang) */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/quiz-hub/play?mode=mcq")}
            className="p-4 rounded-2xl bg-[#BAE6FD] border-3 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] flex items-center justify-center mb-3">
              <GraduationCapSvg size={28} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0369A1] group-hover:underline">
                Latihan Soal
              </h2>
              <p className="text-xs font-bold text-slate-700 mt-0.5 leading-snug">
                Pilihan ganda, visual & rumpang
              </p>
            </div>
            <div className="mt-3.5 inline-flex items-center justify-center w-full py-1.5 rounded-xl bg-white border-2 border-[#0F172A] font-black text-xs text-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
              Mulai Latihan
            </div>
          </motion.div>

          {/* Susun Kata (Scramble) */}
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/quiz-hub/play?mode=scramble")}
            className="p-4 rounded-2xl bg-[#FDE047] border-3 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] flex flex-col justify-between cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] flex items-center justify-center mb-3">
              <CardsSvg size={28} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#854D0E] group-hover:underline">
                Susun Kata
              </h2>
              <p className="text-xs font-bold text-slate-700 mt-0.5 leading-snug">
                Susun potongan kata Duolingo-style
              </p>
            </div>
            <div className="mt-3.5 inline-flex items-center justify-center w-full py-1.5 rounded-xl bg-white border-2 border-[#0F172A] font-black text-xs text-[#0F172A] shadow-[2px_2px_0px_#0F172A]">
              Mulai Susun
            </div>
          </motion.div>
        </div>

        {/* 3. List Kategori Topik Soal */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-600">
              Kategori Topik Soal
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 border border-slate-300">
              4 Topik Tersedia
            </span>
          </div>

          <div className="space-y-3">
            {QUIZ_HUB_CATEGORIES.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -2 }}
                onClick={() => navigate(`/quiz-hub/play?category=${category.id}`)}
                className="p-4 rounded-2xl bg-white border-3 border-[#0F172A] shadow-[4px_4px_0px_#0F172A] flex items-center justify-between gap-3.5 cursor-pointer hover:bg-amber-50/50 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-13 h-13 rounded-2xl border-2 border-[#0F172A] shadow-[2px_2px_0px_#0F172A] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: category.bgBadge }}
                  >
                    {getCategoryIcon(category.id)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-base font-black text-[#0F172A]">
                        {category.title}
                      </h4>
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full border border-[#0F172A]"
                        style={{ backgroundColor: category.bgBadge, color: category.borderColor }}
                      >
                        {category.tag}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-snug line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] border-2 border-[#0F172A] font-black text-xs text-[#0F172A] shadow-[2px_2px_0px_#0F172A] active:translate-y-0.5"
                >
                  Mulai
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. Tombol Tantang Teman di Bagian Bawah */}
        <section className="pt-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsChallengeSheetOpen(true)}
            className="w-full py-4 px-5 rounded-2xl bg-[#C084FC] hover:bg-[#A855F7] border-4 border-[#0F172A] shadow-[5px_5px_0px_#0F172A] flex items-center justify-center gap-3 text-white font-black text-base sm:text-lg cursor-pointer transition-all"
          >
            <SwordsSvg size={26} />
            <span>Tantang Teman (Versus Mode)</span>
          </motion.button>
        </section>
      </main>

      {/* 5. Bottom Sheet Tantang Teman */}
      <AnimatePresence>
        {isChallengeSheetOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setIsChallengeSheetOpen(false)}
            />

            {/* Sheet Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-lg mx-auto bg-white rounded-t-[32px] border-t-4 border-x-4 border-[#0F172A] shadow-[0_-8px_30px_rgba(0,0,0,0.3)] px-5 pt-4 pb-8 flex flex-col"
            >
              {/* Header Bottom Sheet */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#C084FC] border-2 border-[#0F172A] flex items-center justify-center text-white">
                    <SwordsSvg size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0F172A]">Tantang Teman</h3>
                    <p className="text-xs font-bold text-slate-500">Soal sama persis berbasis Seed</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsChallengeSheetOpen(false)}
                  className="w-8 h-8 rounded-full border-2 border-[#0F172A] bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                >
                  <XSvg size={16} />
                </button>
              </div>

              {/* Konten Sheet */}
              <div className="py-4 space-y-4">
                {/* Pilihan Kategori */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600 block mb-2">
                    1. Pilih Kategori Soal:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {QUIZ_HUB_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                          selectedCategory === cat.id
                            ? "bg-[#FEF08A] border-[#0F172A] shadow-[2px_2px_0px_#0F172A] text-[#0F172A]"
                            : "bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div className="shrink-0">{getCategoryIcon(cat.id)}</div>
                        <span className="truncate">{cat.title}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seed Acak */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                      2. Seed Acak Soal:
                    </label>
                    <button
                      type="button"
                      onClick={handleRandomizeSeed}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#0369A1] hover:underline"
                    >
                      <RefreshCwSvg size={12} />
                      <span>Acak Ulang</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 border-2 border-[#0F172A] flex items-center justify-between font-mono font-bold text-sm">
                    <span>Seed: #{seed}</span>
                    <span className="text-[11px] font-sans font-semibold text-slate-500">
                      5 Soal Tersinkronisasi
                    </span>
                  </div>
                </div>

                {/* Tautan Tantangan */}
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-600 block mb-1.5">
                    3. Tautan Tantangan:
                  </label>
                  <div className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-300 text-xs font-mono break-all text-slate-700 select-all">
                    {shareUrl}
                  </div>
                </div>

                {/* Tombol Aksi: Salin & WhatsApp */}
                <div className="pt-2 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="py-3 px-3 rounded-xl bg-white hover:bg-slate-50 border-3 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] font-black text-xs sm:text-sm text-[#0F172A] flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 active:shadow-none"
                  >
                    {isCopied ? <CheckSvg size={16} /> : <CopySvg size={16} />}
                    <span>{isCopied ? "Tersalin!" : "Salin Tautan"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] border-3 border-[#0F172A] shadow-[3px_3px_0px_#0F172A] font-black text-xs sm:text-sm text-white flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5 active:shadow-none"
                  >
                    <WhatsAppSvg size={18} />
                    <span>WhatsApp</span>
                  </button>
                </div>

                {/* Tombol Langsung Mainkan Sendiri */}
                <button
                  type="button"
                  onClick={() => {
                    setIsChallengeSheetOpen(false);
                    navigate(`/quiz-hub/versus?seed=${seed}&category=${selectedCategory}&challenger=${encodeURIComponent(challengerId)}`);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E0F2FE] hover:bg-[#BAE6FD] border-2 border-[#0F172A] font-black text-xs text-[#0369A1] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <SparklesSvg size={14} />
                  <span>Coba Mainkan Sendiri Dulu</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
