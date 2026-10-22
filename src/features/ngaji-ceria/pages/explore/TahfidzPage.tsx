import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  Quran,
  Sparkles,
  Check,
  Play,
  Pause,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  X,
  Star,
  ChevronRight,
  BookOpen,
  Fire,
} from "../../../../components/ui/CustomIcons";
import {
  TAHFIDZ_KATEGORI,
  getTargetsByKategori,
  type TahfidzKategori,
  type TahfidzTarget,
} from "../../data/tahfidzData";
import { useTahfidz, getSurahProgress } from "../../hooks/useTahfidz";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { everyAyahAudio } from "./exploreData";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

interface AyahData {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audioUrl: string;
}

export default function TahfidzPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TahfidzKategori>("juz30");
  const [selectedSurah, setSelectedSurah] = useState<TahfidzTarget | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<"baca" | "uji">("baca");
  const [revealedAyat, setRevealedAyat] = useState<Set<number>>(new Set());
  const [surahAyatList, setSurahAyatList] = useState<AyahData[]>([]);
  const [isLoadingAyat, setIsLoadingAyat] = useState(false);

  const { data, isHafal, toggleHafal, reset, stats, streak } = useTahfidz();
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  const currentTargets = useMemo(() => {
    const list = getTargetsByKategori(activeTab);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (t) =>
        t.namaLatin.toLowerCase().includes(q) ||
        t.arti.toLowerCase().includes(q) ||
        String(t.surah).includes(q),
    );
  }, [activeTab, searchQuery]);

  // Load ayat when a surah is selected
  useEffect(() => {
    if (!selectedSurah) {
      setSurahAyatList([]);
      setRevealedAyat(new Set());
      return;
    }

    let isMounted = true;
    setIsLoadingAyat(true);
    setRevealedAyat(new Set());

    fetch(`https://equran.id/api/v2/surat/${selectedSurah.surah}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (json?.code === 200 && Array.isArray(json?.data?.ayat)) {
          const list: AyahData[] = json.data.ayat.map((a: any) => ({
            nomorAyat: a.nomorAyat,
            teksArab: a.teksArab,
            teksLatin: a.teksLatin,
            teksIndonesia: a.teksIndonesia,
            audioUrl:
              a.audio?.["01"] ||
              everyAyahAudio(selectedSurah.surah, a.nomorAyat),
          }));
          setSurahAyatList(list);
        } else {
          fallbackAyat();
        }
      })
      .catch(() => {
        if (isMounted) fallbackAyat();
      })
      .finally(() => {
        if (isMounted) setIsLoadingAyat(false);
      });

    function fallbackAyat() {
      if (!selectedSurah) return;
      const list: AyahData[] = [];
      for (let i = selectedSurah.ayatStart; i <= selectedSurah.ayatEnd; i++) {
        list.push({
          nomorAyat: i,
          teksArab: `Ayat ${i}`,
          teksLatin: `Surah ${selectedSurah.namaLatin} Ayat ${i}`,
          teksIndonesia: `Terjemahan ayat ke-${i}`,
          audioUrl: everyAyahAudio(selectedSurah.surah, i),
        });
      }
      setSurahAyatList(list);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedSurah]);

  const handleOpenSurah = (target: TahfidzTarget) => {
    triggerBibiReaction("click");
    setSelectedSurah(target);
  };

  const handleToggleAyatHafal = (surahNum: number, ayahNum: number) => {
    const alreadyHafal = isHafal(surahNum, ayahNum);
    toggleHafal(surahNum, ayahNum);
    if (!alreadyHafal) {
      triggerBibiReaction("success");
    } else {
      triggerBibiReaction("click");
    }
  };

  const toggleReveal = (ayahNum: number) => {
    setRevealedAyat((prev) => {
      const next = new Set(prev);
      if (next.has(ayahNum)) next.delete(ayahNum);
      else next.add(ayahNum);
      return next;
    });
  };

  const handleResetAll = () => {
    if (
      window.confirm(
        "Apakah kamu yakin ingin mereset seluruh progress hafalan tahfidz?",
      )
    ) {
      triggerBibiReaction("error");
      reset();
    }
  };

  const selectedProgress = selectedSurah
    ? getSurahProgress(data, selectedSurah)
    : null;

  return (
    <NgajiCeriaLayout
      title="Target Tahfidz"
      hideHeader={true}
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      <div className="min-h-[100dvh] w-full bg-[#FEF3C7] relative overflow-x-hidden pb-28">
        {/* Anyaman bambu */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #FCD34D22 0 6px, transparent 6px 18px), repeating-linear-gradient(-45deg, #D9770622 0 6px, transparent 6px 18px)",
          }}
        />

        <div className="relative z-10">
          {/* HEADER Papan Dojo */}
          <ThemedHeader
            title="Padepokan Hafalan"
            onBack={() => navigate("/member/ngaji-ceria/map")}
            themeColorClass="bg-[#B45309]"
            textColorClass="text-[#FDE68A]"
            statVariant="wood"
            statBgClass="bg-[#78350F]"
            statTextClass="text-[#FBBF24]"
            backClass="bg-[#92400E]"
          />

          {/* HERO: Papan kayu dojo dengan gulung misi */}
          <div className="px-4 pt-6">
            <section className="relative overflow-hidden rounded-[20px] bg-[#78350F] p-5 border-[3px] border-[#FDE68A] shadow-[5px_5px_0px_#451A03]">
              {/* Serat kayu */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, #5C230A44 0 3px, transparent 3px 22px)",
                }}
              />
              {/* Bendera dojo */}
              <div className="absolute right-5 top-4 flex flex-col items-center z-10">
                <div className="w-1.5 h-10 bg-[#FDE68A] rounded-full" />
                <div className="w-14 h-9 bg-[#B91C1C] border-2 border-[#FDE68A] [clip-path:polygon(0_0,100%_0,100%_100%,55%_85%,0_100%)]" />
              </div>
              <div className="relative z-10 max-w-[78%]">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDE68A]/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#FDE68A] border-2 border-[#FDE68A]/35 mb-2">
                  <Sparkles size={12} /> Dojo Al-Qur'an
                </span>
                <h2 className="mt-1 font-display text-xl font-black leading-tight text-[#FDE68A]">
                  Hafalkan Al-Quran, Raih Mahkota Surga
                </h2>
                <p className="mt-1.5 text-[11px] font-bold text-[#FBBF24]/90 leading-relaxed">
                  Naik sabuk demi sabuk dengan misi hafalan ayat demi ayat.
                </p>
              </div>
            </section>
          </div>

          <div className="px-4 pt-4 space-y-4">
          {/* Overall Stats Card (Papan latihan kayu) */}
          <section className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border-[3px] border-[#B45309] bg-[#FDE68A] p-3 text-center shadow-[3px_3px_0px_#B45309]">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#92400E]">
                Total Ayat
              </p>
              <p className="mt-1 text-2xl font-black text-[#7C2D12]">
                {stats.totalHafal}
              </p>
              <span className="text-[10px] font-bold text-[#92400E]">
                / {stats.totalAyat}
              </span>
            </div>

            <div className="rounded-xl border-[3px] border-[#B45309] bg-[#BBF7D0] p-3 text-center shadow-[3px_3px_0px_#B45309]">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#166534]">
                Surah Selesai
              </p>
              <p className="mt-1 text-2xl font-black text-[#7C2D12]">
                {stats.surahSelesai}
              </p>
              <span className="text-[10px] font-bold text-[#166534]">
                / {stats.totalSurah}
              </span>
            </div>

            <div className="rounded-xl border-[3px] border-[#B91C1C] bg-[#FECACA] p-3 text-center shadow-[3px_3px_0px_#B91C1C]">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#9F1239] flex items-center justify-center gap-1">
                <Fire size={12} className="text-[#E11D48]" /> Streak
              </p>
              <p className="mt-1 text-2xl font-black text-[#7C2D12]">
                {streak}
              </p>
              <span className="text-[10px] font-bold text-[#9F1239]">
                Hari Aktif
              </span>
            </div>
          </section>

          {/* Tab kategori: bar bambu */}
          <section className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {TAHFIDZ_KATEGORI.map((kat) => {
              const isActive = activeTab === kat.key;
              return (
                <button
                  key={kat.key}
                  type="button"
                  onClick={() => {
                    triggerBibiReaction("click");
                    setActiveTab(kat.key);
                  }}
                  className={`flex items-center gap-2 rounded-lg border-[3px] border-[#B45309] px-4 py-2.5 text-xs font-black whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#B45309] text-[#FDE68A] shadow-[3px_3px_0px_#7C2D12] translate-y-[-1px]"
                      : "bg-[#FFFBEB] text-[#92400E] shadow-[2px_2px_0px_#B45309] hover:bg-[#FEF3C7]"
                  }`}
                >
                  <span>{kat.emoji}</span> {kat.label}
                </button>
              );
            })}
          </section>

          {/* Search Bar */}
          <section>
            <div className="flex items-center gap-2 rounded-full border-[3px] border-[#B45309] bg-[#FFFBEB] px-4 py-2.5 shadow-[3px_3px_0px_#B45309]">
              <Search size={18} className="text-[#92400E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari misi surah..."
                className="w-full bg-transparent text-sm font-bold text-[#7C2D12] placeholder:text-[#7C2D12]/40 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs font-bold text-[#7C2D12]/60"
                >
                  ✕
                </button>
              )}
            </div>
          </section>
          </div>

        {/* Surah List Cards (Sticker Style) */}
          {/* Daftar target: Gulungan Misi */}
          <section className="space-y-3 px-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-sm text-[#7C2D12]">
                Misi Padepokan ({currentTargets.length})
              </h3>
            {stats.totalHafal > 0 && (
              <button
                type="button"
                onClick={handleResetAll}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E11D48] hover:underline"
              >
                <RefreshCw size={12} /> Reset Progress
              </button>
            )}
          </div>

          <div className="space-y-3">
            {currentTargets.map((target) => {
              const progress = getSurahProgress(data, target);
              const belt = progress.percentage >= 100
                ? { w: "bg-[#111827]", tip: "bg-[#B45309]" }
                : progress.percentage >= 66
                  ? { w: "bg-[#7C2D12]", tip: "bg-[#FDE68A]" }
                  : progress.percentage >= 33
                    ? { w: "bg-[#FEF08A]", tip: "bg-[#16A34A]" }
                    : { w: "bg-white", tip: "bg-[#FDE68A]" };
              return (
                <motion.div
                  key={target.surah}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOpenSurah(target)}
                  className="relative w-full cursor-pointer"
                >
                  <div className="w-full rounded-[20px] border-[3px] border-[#78350F] bg-[#FFFBEB] p-3.5 shadow-[3px_3px_0px_#78350F] transition-all active:translate-y-[3px] active:shadow-none">
                    <div className="flex items-center justify-between gap-3">
                      {/* Lencana Dojo (nomor) */}
                      <div className="relative shrink-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-[3px] border-[#B91C1C] bg-[#FBBF24] font-display text-sm font-black text-[#7C2D12] shadow-[2px_2px_0px_#B45309]">
                          {target.surah}
                        </div>
                        {/* Pita merah lencana */}
                        <span className="absolute -bottom-2 left-1.5 w-2 h-5 bg-[#B91C1C] border border-[#7F1D1D] rotate-[-14deg]" />
                        <span className="absolute -bottom-2 right-1.5 w-2 h-5 bg-[#B91C1C] border border-[#7F1D1D] rotate-[14deg]" />
                      </div>

                      {/* Info Surah */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-display font-black text-base text-[#7C2D12] truncate">
                            {target.namaLatin}
                          </h4>
                          {progress.complete && (
                            <span className="inline-flex items-center gap-1 rounded-md border border-[#15803D] bg-[#DCFCE7] px-2 py-0.5 text-[9px] font-black text-[#15803D]">
                              <Check size={10} /> Selesai
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-bold text-[#92400E]/70 truncate">
                          {target.arti} • {target.jumlahAyat} Ayat
                        </p>
                      </div>

                      {/* Persentase & Panah */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-[#7C2D12]">
                            {progress.hafal}/{progress.total}
                          </span>
                          <p className="text-[10px] font-black text-[#B45309]">
                            {progress.percentage}%
                          </p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#78350F] bg-[#FEF3C7] shadow-[2px_2px_0px_#78350F]">
                          <ChevronRight size={14} className="text-[#92400E]" />
                        </div>
                      </div>
                    </div>

                    {/* Sabuk Karate */}
                    <div className="mt-3 flex items-center gap-2">
                      <div className="relative h-3 flex-1 rounded-full border-2 border-[#92400E] bg-[#78350F] overflow-hidden">
                        <div
                          className={`h-full rounded-r-full ${belt.w} transition-all duration-300`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Modal Latihan (kedalaman dojo) */}
        <AnimatePresence>
          {selectedSurah && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="relative max-h-[90vh] w-full max-w-xl flex flex-col rounded-t-[32px] sm:rounded-[32px] border-[3px] border-[#134E4A] bg-[#F0FDF4] shadow-[6px_6px_0px_#134E4A] overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b-[3px] border-[#134E4A] bg-[#134E4A] p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#FEF08A] bg-[#FEF08A] font-display text-sm font-black text-[#134E4A]">
                      {selectedSurah.surah}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-black leading-tight text-white">
                        {selectedSurah.namaLatin}
                      </h3>
                      <p className="text-[11px] font-semibold text-white/80">
                        {selectedSurah.arti} • {selectedProgress?.hafal || 0}/
                        {selectedSurah.jumlahAyat} Hafal (
                        {selectedProgress?.percentage || 0}%)
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSurah(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white/20 bg-white/10 text-white hover:bg-white/20 active:scale-95"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Subheader: Mode Switcher (Sticker) */}
                <div className="flex items-center justify-between border-b-2 border-[#134E4A]/10 bg-white px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setMode("baca")}
                      className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                        mode === "baca"
                          ? "bg-[#0284C7] text-white shadow-[2px_2px_0px_#134E4A]"
                          : "bg-white text-[#134E4A] shadow-none"
                      }`}
                    >
                      <BookOpen size={13} /> Mode Baca
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("uji")}
                      className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                        mode === "uji"
                          ? "bg-[#D97706] text-white shadow-[2px_2px_0px_#134E4A]"
                          : "bg-white text-[#134E4A] shadow-none"
                      }`}
                    >
                      <EyeOff size={13} /> Mode Uji (Tutup Teks)
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-[#134E4A]/70">
                    {mode === "uji" ? "Uji Ingatanmu" : "Hafalkan"}
                  </span>
                </div>

                {/* Ayat List Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingAyat ? (
                    <div className="py-16 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0D9488]/30 border-t-[#0D9488]" />
                      <p className="mt-2 text-xs font-bold text-[#134E4A]">
                        Memuat ayat surah...
                      </p>
                    </div>
                  ) : (
                    surahAyatList.map((ayah) => {
                      const hafalStatus = isHafal(
                        selectedSurah.surah,
                        ayah.nomorAyat,
                      );
                      const isRevealed = revealedAyat.has(ayah.nomorAyat);
                      const isAyahAudioActive =
                        isPlaying && currentAudioUrl === ayah.audioUrl;

                      return (
                        <div
                          key={ayah.nomorAyat}
                          className={`rounded-2xl border-[3px] border-[#134E4A] p-4 transition-all ${
                            hafalStatus
                              ? "bg-[#F0FDF4] shadow-[3px_3px_0px_#15803D]"
                              : "bg-white shadow-[3px_3px_0px_#134E4A]"
                          }`}
                        >
                          {/* Baris Kontrol Atas Ayat */}
                          <div className="flex items-center justify-between mb-3 border-b pb-2 border-[#134E4A]/10">
                            <div className="flex items-center gap-2">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] text-xs font-black text-[#134E4A]">
                                {ayah.nomorAyat}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggle(ayah.audioUrl)}
                                className={`flex h-7 items-center gap-1.5 rounded-lg border-2 border-[#134E4A] px-2.5 text-[11px] font-bold transition-all active:scale-95 ${
                                  isAyahAudioActive
                                    ? "bg-[#0284C7] text-white"
                                    : "bg-[#E0F2FE] text-[#0284C7]"
                                }`}
                              >
                                {isAyahAudioActive ? (
                                  <Pause size={11} />
                                ) : (
                                  <Play size={11} />
                                )}
                                Dengar
                              </button>
                            </div>

                            {/* Tombol Checklist Hafal */}
                            <button
                              type="button"
                              onClick={() =>
                                handleToggleAyatHafal(
                                  selectedSurah.surah,
                                  ayah.nomorAyat,
                                )
                              }
                              className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1 text-xs font-black transition-all active:scale-95 ${
                                hafalStatus
                                  ? "bg-[#10B981] text-white shadow-[2px_2px_0px_#134E4A]"
                                  : "bg-white text-[#134E4A]/70 hover:bg-slate-50"
                              }`}
                            >
                              <Check size={14} />
                              {hafalStatus ? "Hafal" : "Belum"}
                            </button>
                          </div>

                          {/* Teks Arab (Bisa di-blur pada mode uji) */}
                          <div className="relative py-2">
                            {mode === "uji" && !isRevealed ? (
                              <div className="flex flex-col items-center justify-center py-6 rounded-xl border-2 border-dashed border-[#134E4A]/30 bg-slate-50">
                                <p className="text-xs font-bold text-[#134E4A]/60 mb-2">
                                  Teks ayat disembunyikan untuk menguji ingatanmu
                                </p>
                                <button
                                  type="button"
                                  onClick={() => toggleReveal(ayah.nomorAyat)}
                                  className="flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-3 py-1.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px]"
                                >
                                  <Eye size={13} /> Intip Ayat
                                </button>
                              </div>
                            ) : (
                              <div>
                                <p
                                  className="font-arabic text-[26px] sm:text-[30px] text-right leading-[2.2] text-[#134E4A]"
                                  dir="rtl"
                                >
                                  {ayah.teksArab}
                                </p>

                                {mode === "uji" && isRevealed && (
                                  <div className="mt-2 text-right">
                                    <button
                                      type="button"
                                      onClick={() => toggleReveal(ayah.nomorAyat)}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-[#D97706] hover:underline"
                                    >
                                      <EyeOff size={11} /> Tutup Kembali
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Teks Latin & Arti (Hanya muncul jika mode baca atau sudah diintip) */}
                          {(mode === "baca" || isRevealed) && (
                            <div className="mt-2 space-y-1.5 border-t border-[#134E4A]/10 pt-2 text-left">
                              {ayah.teksLatin && (
                                <p className="text-xs font-bold text-[#0D9488] italic">
                                  {ayah.teksLatin}
                                </p>
                              )}
                              {ayah.teksIndonesia && (
                                <p className="text-xs font-medium text-[#134E4A]/80 leading-relaxed">
                                  {ayah.teksIndonesia}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
