import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  BookOpen,
  Check,
  Play,
  Pause,
  Eye,
  EyeOff,
} from "../../../../components/ui/CustomIcons";
import {
  getTargetBySurah,
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

export default function TahfidzDetailPage() {
  const navigate = useNavigate();
  const { surah } = useParams<{ surah: string }>();
  const [selectedSurah, setSelectedSurah] = useState<TahfidzTarget | null>(
    null,
  );
  const [mode, setMode] = useState<"baca" | "uji">("baca");
  const [revealedAyat, setRevealedAyat] = useState<Set<number>>(new Set());
  const [surahAyatList, setSurahAyatList] = useState<AyahData[]>([]);
  const [isLoadingAyat, setIsLoadingAyat] = useState(false);

  const { data, isHafal, toggleHafal } = useTahfidz();
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  // Resolve target dari route param
  useEffect(() => {
    const target = surah ? getTargetBySurah(Number(surah)) : undefined;
    if (target) {
      setSelectedSurah(target);
    }
  }, [surah]);

  // Load ayat saat surah ini terpilih
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

  // Surah tidak dikenal (param salah)
  if (!selectedSurah) {
    return (
      <NgajiCeriaLayout
        title="Target Tahfidz"
        showBack
        onBack={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
      >
        <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="font-display text-lg font-black text-[#134E4A]">
            Surah tidak ditemukan
          </p>
          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
            className="rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-4 py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A]"
          >
            Kembali ke Daftar Target
          </button>
        </div>
      </NgajiCeriaLayout>
    );
  }

  const selectedProgress = getSurahProgress(data, selectedSurah);

  return (
    <NgajiCeriaLayout
      title={`Tahfidz ${selectedSurah.namaLatin}`}
      hideHeader={true}
      showBack
      onBack={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
    >
      <div className="min-h-[100dvh] w-full relative overflow-x-hidden bg-[#FEF3C7] pb-32">
        <ThemedHeader
          title={`Tahfidz ${selectedSurah.namaLatin}`}
          onBack={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
          themeColorClass="bg-[#B45309]"
          textColorClass="text-[#FDE047]"
          statVariant="wood"
          statBgClass="bg-[#92400E] text-[#FDE047]"
          backClass="bg-[#FDE047] text-[#134E4A]"
        />
        <div className="relative z-10">
        {/* Page Header (Sticker Style) */}
        <div className="relative overflow-hidden border-b-[3px] border-[#134E4A] bg-[#134E4A] p-4 text-white">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#FEF08A] bg-[#FEF08A] font-display text-sm font-black text-[#134E4A]">
                {selectedSurah.surah}
              </div>
              <div>
                <h3 className="font-display text-lg font-black leading-tight text-white">
                  {selectedSurah.namaLatin}
                </h3>
                <p className="text-[11px] font-semibold text-white/80">
                  {selectedSurah.arti} • {selectedProgress.hafal}/
                  {selectedSurah.jumlahAyat} Hafal (
                  {selectedProgress.percentage}%)
                </p>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mx-auto mt-3 h-3 w-full max-w-3xl overflow-hidden rounded-full border-2 border-white/30 bg-white/10">
            <div
              className="h-full bg-[#10B981] transition-all duration-300"
              style={{ width: `${selectedProgress.percentage}%` }}
            />
          </div>
        </div>

        {/* Mode Switcher (Sticky) */}
        <div className="sticky top-14 z-20 flex items-center justify-between gap-2 border-b-[3px] border-[#134E4A]/10 bg-white px-4 py-3">
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

        {/* Ayat List */}
        <div className="space-y-4 p-4">
          {isLoadingAyat ? (
            <div className="py-16 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#0D9488]/30 border-t-[#0D9488]" />
              <p className="mt-2 text-xs font-bold text-[#134E4A]">
                Memuat ayat surah...
              </p>
            </div>
          ) : (
            surahAyatList.map((ayah) => {
              const hafalStatus = isHafal(selectedSurah.surah, ayah.nomorAyat);
              const isRevealed = revealedAyat.has(ayah.nomorAyat);
              const isAyahAudioActive =
                isPlaying && currentAudioUrl === ayah.audioUrl;

              return (
                <div
                  key={ayah.nomorAyat}
                  className={`rounded-2xl border-[3px] border-[#134E4A] bg-[#F0FDF4] p-4 transition-all ${
                    hafalStatus
                      ? "shadow-[3px_3px_0px_#15803D]"
                      : "shadow-[3px_3px_0px_#134E4A]"
                  }`}
                >
                  {/* Baris Kontrol Atas Ayat */}
                  <div className="mb-3 flex items-center justify-between border-b border-[#134E4A]/10 pb-2">
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
                      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#134E4A]/30 bg-slate-50 py-6">
                        <p className="mb-2 text-xs font-bold text-[#134E4A]/60">
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
                          className="font-arabic text-[26px] text-right leading-[2.2] text-[#134E4A]"
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
                        <p className="text-xs font-medium leading-relaxed text-[#134E4A]/80">
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
        </div>
      </div>
    </NgajiCeriaLayout>
  );
}
