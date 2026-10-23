import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  BookOpen,
  Play,
  Pause,
  Eye,
  EyeOff,
} from "../../../../components/ui/CustomIcons";
import { LenteraIcon } from "../../components/LenteraIcon";
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
          <LenteraIcon size={48} lit={false} className="opacity-60 mb-2" />
          <p className="font-display text-lg font-black text-[#134E4A]">
            Surah tidak ditemukan
          </p>
          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
            className="rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-4 py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#FDE047]"
          >
            Kembali ke Menara Tahfidz
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
      <div className="min-h-[100dvh] w-full relative overflow-x-hidden bg-[#FEF9EF] pb-32">
        {/* Background Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(#134E4A 1.5px, transparent 1.5px)",
            backgroundSize: "20px 20px",
          }}
        />

        <ThemedHeader
          title={`Tahfidz ${selectedSurah.namaLatin}`}
          onBack={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
          themeColorClass="bg-[#134E4A]"
          textColorClass="text-[#FEF08A]"
          statVariant="capsule"
          statBgClass="bg-[#0f3d3a] border-2 border-[#FEF08A]/30"
          statTextClass="text-[#FEF08A]"
          backClass="bg-[#FEF08A] text-[#134E4A] shadow-[2px_2px_0px_#062E2C] hover:bg-[#FDE047]"
        />

        <div className="relative z-10">
          {/* Header Panel Surah: Lentera Menara Noor */}
          <div className="relative overflow-hidden border-b-[3px] border-[#134E4A] bg-[#134E4A] p-4 text-white">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-[#134E4A] bg-[#FEF08A] font-display text-base font-black text-[#134E4A] shadow-[2px_2px_0px_#062E2C]">
                  {selectedSurah.surah}
                </div>
                <div>
                  <h3 className="font-display text-lg font-black leading-tight text-[#FEF08A]">
                    {selectedSurah.namaLatin}
                  </h3>
                  <p className="text-[11px] font-semibold text-white/90">
                    {selectedSurah.arti} • {selectedProgress.hafal}/
                    {selectedSurah.jumlahAyat} Pelita Terang (
                    {selectedProgress.percentage}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Saf Lentera Progress Bar */}
            <div className="mx-auto mt-3 flex items-center gap-2 max-w-3xl">
              <div className="relative h-3.5 flex-1 rounded-full border-2 border-[#FEF08A]/40 bg-[#062E2C] overflow-hidden">
                <div
                  className={`h-full rounded-r-full transition-all duration-300 ${
                    selectedProgress.complete
                      ? "bg-[#10B981]"
                      : selectedProgress.percentage >= 60
                        ? "bg-[#F59E0B]"
                        : selectedProgress.percentage >= 25
                          ? "bg-[#FBBF24]"
                          : "bg-[#FEF08A]"
                  }`}
                  style={{ width: `${selectedProgress.percentage}%` }}
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <LenteraIcon size={14} lit={selectedProgress.percentage > 0} />
                <span className="text-[10px] font-black text-[#FEF08A]">
                  {selectedProgress.complete ? "Khatam!" : `${selectedProgress.hafal} Pelita`}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher (Sticky Neo-Brutalism) */}
          <div className="sticky top-14 z-20 flex items-center justify-between gap-2 border-b-[3px] border-[#134E4A]/15 bg-white px-4 py-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("baca")}
                className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                  mode === "baca"
                    ? "bg-[#134E4A] text-[#FEF08A] shadow-[2px_2px_0px_#062E2C]"
                    : "bg-white text-[#134E4A] shadow-none hover:bg-[#FEF9EF]"
                }`}
              >
                <BookOpen size={13} /> Dengar & Baca
              </button>
              <button
                type="button"
                onClick={() => setMode("uji")}
                className={`flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-3 py-1.5 text-xs font-black transition-all ${
                  mode === "uji"
                    ? "bg-[#EA580C] text-white shadow-[2px_2px_0px_#134E4A]"
                    : "bg-white text-[#134E4A] shadow-none hover:bg-[#FEF9EF]"
                }`}
              >
                <EyeOff size={13} /> Tutup Kitab (Uji Diri)
              </button>
            </div>

            <span className="text-[11px] font-black text-[#134E4A]/70">
              {mode === "uji" ? "Uji Ingatan" : "Hafalkan"}
            </span>
          </div>

          {/* Ayat List */}
          <div className="space-y-4 p-4 max-w-3xl mx-auto">
            {isLoadingAyat ? (
              <div className="py-16 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#134E4A]/30 border-t-[#134E4A]" />
                <p className="mt-2 text-xs font-black text-[#134E4A]">
                  Memuat pelita ayat...
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
                    className={`rounded-2xl border-[3px] border-[#134E4A] p-4 transition-all ${
                      hafalStatus
                        ? "bg-[#F0FDF4] shadow-[3.5px_3.5px_0px_#10B981]"
                        : "bg-white shadow-[3.5px_3.5px_0px_#134E4A]"
                    }`}
                  >
                    {/* Baris Kontrol Atas Ayat */}
                    <div className="mb-3 flex items-center justify-between border-b border-[#134E4A]/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#134E4A] bg-[#FEF08A] text-xs font-black text-[#134E4A] shadow-[1.5px_1.5px_0px_#134E4A]">
                          {ayah.nomorAyat}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggle(ayah.audioUrl)}
                          className={`flex h-7 items-center gap-1.5 rounded-lg border-2 border-[#134E4A] px-2.5 text-[11px] font-black transition-all active:scale-95 shadow-[1.5px_1.5px_0px_#134E4A] ${
                            isAyahAudioActive
                              ? "bg-[#0D9488] text-white"
                              : "bg-[#FEF9EF] text-[#134E4A] hover:bg-[#FEF08A]"
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
                            : "bg-white text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#FEF9EF]"
                        }`}
                      >
                        <LenteraIcon size={13} lit={hafalStatus} />
                        {hafalStatus ? "Hafal" : "Belum"}
                      </button>
                    </div>

                    {/* Teks Arab (Bisa ditutup pelita pada mode uji) */}
                    <div className="relative py-2">
                      {mode === "uji" && !isRevealed ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#134E4A]/40 bg-[#FEF9EF] py-6 px-4 text-center">
                          <LenteraIcon size={28} lit={false} className="mb-2 opacity-70" />
                          <p className="mb-2 text-xs font-bold text-[#134E4A]/70">
                            Pelita ditutup agar kamu menguji ingatan hafalanmu
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleReveal(ayah.nomorAyat)}
                            className="flex items-center gap-1.5 rounded-xl border-2 border-[#134E4A] bg-[#FEF08A] px-3.5 py-1.5 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] hover:bg-[#FDE047] active:translate-y-[1px]"
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
                                className="inline-flex items-center gap-1 text-[11px] font-black text-[#EA580C] hover:underline"
                              >
                                <EyeOff size={11} /> Tutup Pelita Kembali
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Teks Latin & Arti */}
                    {(mode === "baca" || isRevealed) && (
                      <div className="mt-2 space-y-1.5 border-t border-[#134E4A]/10 pt-2 text-left">
                        {ayah.teksLatin && (
                          <p className="text-xs font-bold text-[#0D9488] italic">
                            {ayah.teksLatin}
                          </p>
                        )}
                        {ayah.teksIndonesia && (
                          <p className="text-xs font-medium leading-relaxed text-[#134E4A]/90">
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
