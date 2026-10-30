import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  Sparkles,
  RefreshCw,
  Search,
  X,
  BookOpen,
  Fire,
  Trophy,
  Quran,
  Crown,
  Sprout,
  PaperBoatSvg,
  type SvgProps,
} from "../../../../components/ui/CustomIcons";
import { LenteraIcon } from "../../components/LenteraIcon";
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

/** ── SILUET PEGUNUNGAN & AWAN PUNCAK (SVG Statis Solid) ── */
const MountainPeaksBackdropSvg = ({
  className = "",
}: {
  className?: string;
}) => (
  <svg
    className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    viewBox="0 0 400 500"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {/* Barisan Puncak Gunung Bersalju di Kejauhan */}
    <polygon
      points="0,240 85,90 175,240"
      fill="#64748B"
      stroke="#1E293B"
      strokeWidth="3"
    />
    <polygon
      points="85,90 60,135 85,125 110,135"
      fill="#F8FAFC"
      stroke="#1E293B"
      strokeWidth="2"
    />
    <polygon
      points="120,250 230,65 340,250"
      fill="#475569"
      stroke="#1E293B"
      strokeWidth="3"
    />
    <polygon
      points="230,65 198,120 230,108 262,120"
      fill="#F8FAFC"
      stroke="#1E293B"
      strokeWidth="2"
    />
    <polygon
      points="260,250 345,110 420,250"
      fill="#64748B"
      stroke="#1E293B"
      strokeWidth="3"
    />
  </svg>
);

// Pemetaan ikon khusus untuk tab kategori
const KATEGORI_ICON_MAP: Record<string, React.FC<SvgProps>> = {
  juz30: Quran,
  pendek: Sprout,
  pilihan: Crown,
  default: PaperBoatSvg,
};

export default function TahfidzPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TahfidzKategori>("juz30");
  const [selectedSurah, setSelectedSurah] = useState<TahfidzTarget | null>(
    null,
  );
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
    navigate(`/member/ngaji-ceria/explore/tahfidz/${target.surah}`);
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
        "Apakah kamu yakin ingin mengulang pendakian hafalanmu dari kaki gunung?",
      )
    ) {
      triggerBibiReaction("error");
      reset();
    }
  };

  const selectedProgress = selectedSurah
    ? getSurahProgress(data, selectedSurah)
    : null;

  // Suppress unused variable warnings while preserving business state
  void mode;
  void setMode;
  void revealedAyat;
  void surahAyatList;
  void isLoadingAyat;
  void isPlaying;
  void currentAudioUrl;
  void toggle;
  void handleToggleAyatHafal;
  void toggleReveal;
  void selectedProgress;

  return (
    <NgajiCeriaLayout
      title="Puncak Gunung Tahfidz"
      hideHeader={true}
      themeScope="tahfidz"
      onBack={() => navigate("/member/ngaji-ceria/map")}
    >
      {/* Latar Jalur Pendakian Gunung Berbatu (#CBD5E1) */}
      <div className="min-h-[100dvh] w-full bg-[#CBD5E1] relative overflow-x-hidden pb-32 select-none">
        <MountainPeaksBackdropSvg className="opacity-35" />

        {/* HEADER Puncak Gunung */}
        <ThemedHeader
          title="Puncak Gunung Tahfidz"
          onBack={() => navigate("/member/ngaji-ceria/map")}
          themeColorClass="bg-[#475569] border-b-[4px] border-[#1E293B]"
          textColorClass="text-[#FEF08A]"
          statVariant="capsule"
          statBgClass="bg-[#1E293B] text-[#FEF08A]"
          backClass="bg-[#FEF08A] text-[#1E293B] border-[2.5px] border-[#1E293B]"
        />

        <div className="relative z-10 px-4 pt-5 max-w-3xl mx-auto">
          {/* ── HERO POS PENDAKIAN PUNCAK GUNUNG ── */}
          <section className="relative overflow-hidden rounded-[24px] border-[4px] border-[#1E293B] bg-[#475569] p-5 text-[#FFFFFF] shadow-[6px_6px_0px_#1E293B]">
            {/* Ilustrasi Puncak Gunung & Bendera di Kanan */}
            <div className="pointer-events-none absolute right-3 top-3 bottom-3 flex w-[30%] items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-28 h-28">
                {/* Bendera Puncak */}
                <line
                  x1="60"
                  y1="10"
                  x2="60"
                  y2="40"
                  stroke="#1E293B"
                  strokeWidth="4"
                />
                <polygon
                  points="60,10 92,20 60,30"
                  fill="#EF4444"
                  stroke="#1E293B"
                  strokeWidth="3"
                />
                {/* Gunung Batu */}
                <polygon
                  points="12,110 60,35 108,110"
                  fill="#64748B"
                  stroke="#1E293B"
                  strokeWidth="4"
                  strokeLinejoin="round"
                />
                {/* Salju Puncak */}
                <polygon
                  points="60,35 42,63 54,58 60,66 68,58 78,63"
                  fill="#F8FAFC"
                  stroke="#1E293B"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="relative z-10 max-w-[70%]">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-xl border-[2.5px] border-[#1E293B] bg-[#FEF08A] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                <Sparkles size={13} />
                <span>Ekspedisi Puncak Hafalan</span>
              </span>
              <h2 className="mt-1 font-display text-xl sm:text-2xl font-black leading-tight text-[#FFFFFF]">
                Daki Tangga Batu Surah Menuju Puncak!
              </h2>

              {/* Mini Badges Stats Pendakian */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#1E293B] bg-[#FEF08A] px-2.5 py-1 text-[10px] font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                  <BookOpen size={12} />
                  <span>
                    {stats.totalHafal}/{stats.totalAyat} Batu Ayat
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#1E293B] bg-[#4ADE80] px-2.5 py-1 text-[10px] font-black text-[#14532D] shadow-[2px_2px_0px_#1E293B]">
                  <Trophy size={12} />
                  <span>{stats.surahSelesai} Puncak</span>
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg border-[2.5px] border-[#1E293B] bg-[#EF4444] px-2.5 py-1 text-[10px] font-black text-[#FFFFFF] shadow-[2px_2px_0px_#1E293B]">
                  <Fire size={12} />
                  <span>{streak} Hari</span>
                </span>
              </div>
            </div>
          </section>

          {/* ── FILTER JALUR PENDAKIAN & PENCARIAN ── */}
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
              <div className="flex gap-2">
                {TAHFIDZ_KATEGORI.map((kat, idx) => {
                  const isActive = activeTab === kat.key;
                  const IconComponent =
                    KATEGORI_ICON_MAP[kat.key] ||
                    (idx === 0
                      ? Quran
                      : idx === 1
                        ? Sprout
                        : idx === 2
                          ? Crown
                          : PaperBoatSvg);

                  return (
                    <motion.button
                      key={kat.key}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        triggerBibiReaction("click");
                        setActiveTab(kat.key);
                      }}
                      className={`flex items-center gap-2 rounded-2xl border-[3px] border-[#1E293B] px-4 py-2.5 text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#FEF08A] text-[#1E293B] shadow-[3px_3px_0px_#1E293B] -translate-y-0.5"
                          : "bg-[#64748B] text-[#FFFFFF] hover:bg-[#475569]"
                      }`}
                    >
                      <IconComponent size={16} />
                      <span>{kat.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {stats.totalHafal > 0 && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="inline-flex items-center gap-1 rounded-xl border-[2.5px] border-[#1E293B] bg-[#EF4444] px-2.5 py-2 text-[10px] font-black text-[#FFFFFF] shadow-[2px_2px_0px_#1E293B] shrink-0 cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Ulang</span>
                </button>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-3 rounded-2xl border-[3.5px] border-[#1E293B] bg-[#F8FAFC] px-4 py-2.5 shadow-[4px_4px_0px_#1E293B]">
              <Search size={18} className="text-[#475569]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pos batu surah (misal: An-Nas, Al-Ikhlas)..."
                className="w-full bg-transparent text-xs sm:text-sm font-black text-[#1E293B] placeholder:text-[#64748B] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Bersihkan pencarian"
                  className="flex h-6 w-6 items-center justify-center rounded-full"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* ── JALUR PENDAKIAN BERBATU: TANGGA BATU VERTIKAL BERKELOK (STEPPER) ── */}
          {currentTargets.length === 0 ? (
            <div className="mt-8 rounded-[24px] border-[4px] border-dashed border-[#475569] bg-[#E2E8F0] p-8 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#FEF08A] border-[3px] border-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                <LenteraIcon size={32} lit={false} />
              </div>
              <p className="font-display font-black text-base text-[#1E293B]">
                Pos Pendakian Surah Tidak Ditemukan
              </p>
              <p className="text-xs font-bold text-[#475569] mt-1">
                Coba ketik kata kunci lain atau pilih jalur kategori di atas ya.
              </p>
            </div>
          ) : (
            <div className="relative mt-8 flex flex-col gap-6 pb-8">
              {/* Jalur Tambang Pendakian Vertikal di Tengah */}
              <div className="pointer-events-none absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-2 bg-[#78350F] border-x-[2px] border-[#451A03]" />

              {currentTargets.map((target, i) => {
                const progress = getSurahProgress(data, target);
                const isLit = progress.hafal > 0;
                // Zig-zag berkelok menyerupai tangga batu pendakian
                const stepAlignClass =
                  i % 2 === 0
                    ? "self-start sm:w-[82%] mr-auto"
                    : "self-end sm:w-[82%] ml-auto";

                return (
                  <motion.button
                    key={target.surah}
                    type="button"
                    onClick={() => handleOpenSurah(target)}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative z-10 w-full ${stepAlignClass} flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-[24px_16px_24px_16px] border-[4px] border-[#1E293B] p-4 text-left shadow-[6px_6px_0px_#1E293B] transition-all cursor-pointer ${
                      progress.complete
                        ? "bg-[#DCFCE7]"
                        : isLit
                          ? "bg-[#FEF3C7]"
                          : "bg-[#64748B]"
                    }`}
                  >
                    {/* Anak Tangga Batu Nomor Urut */}
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#1E293B] bg-[#FEF08A] text-base font-display font-black text-[#1E293B] shadow-[3px_3px_0px_#1E293B]">
                        #{i + 1}
                      </span>
                      <div>
                        <span className="inline-block rounded-md bg-[#1E293B] px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-[#FEF08A]">
                          Tangga Batu • QS. {target.surah}
                        </span>
                        <h3
                          className={`font-display font-black text-base sm:text-lg leading-tight mt-0.5 ${
                            progress.complete || isLit
                              ? "text-[#1E293B]"
                              : "text-[#FFFFFF]"
                          }`}
                        >
                          {target.namaLatin}
                        </h3>
                        <p
                          className={`text-xs font-bold ${
                            progress.complete || isLit
                              ? "text-[#475569]"
                              : "text-[#E2E8F0]"
                          }`}
                        >
                          {target.arti} • {progress.hafal}/{progress.total} Ayat
                        </p>
                      </div>
                    </div>

                    {/* Indikator Progres Pijakan Batu */}
                    <div className="flex sm:w-48 flex-col justify-center gap-1.5 rounded-xl border-[3px] border-[#1E293B] bg-[#F8FAFC] p-2.5 shadow-[3px_3px_0px_#1E293B]">
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#CBD5E1] border border-[#1E293B]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progress.complete ? "bg-[#15803D]" : "bg-[#D97706]"
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                      <span
                        className={`inline-flex items-center justify-center gap-1.5 rounded-lg border-[2px] border-[#1E293B] py-1 text-[11px] font-black shadow-[1.5px_1.5px_0px_#1E293B] ${
                          progress.complete
                            ? "bg-[#4ADE80] text-[#14532D]"
                            : isLit
                              ? "bg-[#FACC15] text-[#1E293B]"
                              : "bg-[#78350F] text-[#FEF08A]"
                        }`}
                      >
                        <LenteraIcon size={13} lit={isLit} />
                        {progress.complete
                          ? "Tiba di Puncak"
                          : isLit
                            ? "Lanjut Mendaki"
                            : "Mulai Daki"}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
