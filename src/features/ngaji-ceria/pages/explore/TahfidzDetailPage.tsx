import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import {
  BookOpen,
  Play,
  Eye,
  EyeOff,
} from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { LenteraIcon } from "../../components/LenteraIcon";
import { getTargetBySurah, type TahfidzTarget } from "../../data/tahfidzData";
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
  const { surah, surahId } = useParams<{ surah?: string; surahId?: string }>();
  const [selectedSurah, setSelectedSurah] = useState<TahfidzTarget | null>(
    null,
  );
  const [mode, setMode] = useState<"baca" | "uji">("baca");
  const [revealedAyat, setRevealedAyat] = useState<Set<number>>(new Set());
  const [surahAyatList, setSurahAyatList] = useState<AyahData[]>([]);
  const [isLoadingAyat, setIsLoadingAyat] = useState(false);

  const { data, isHafal, toggleHafal } = useTahfidz();
  const { isPlaying, currentAudioUrl, toggle } = useAudioPlayer();

  // Resolve target dari route param (:surahId atau :surah)
  useEffect(() => {
    const paramVal = surahId || surah;
    const target = paramVal ? getTargetBySurah(Number(paramVal)) : undefined;
    if (target) {
      setSelectedSurah(target);
    }
  }, [surah, surahId]);

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
        title="Puncak Tahfidz"
        showBack
        themeScope="tahfidz"
        onBack={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
      >
        <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6 text-center bg-[#CBD5E1]">
          <LenteraIcon size={48} lit={false} className="opacity-60 mb-2" />
          <p className="font-display text-lg font-black text-[#1E293B]">
            Prasasti Surah tidak ditemukan
          </p>
          <button
            type="button"
            onClick={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
            className="rounded-xl border-[3px] border-[#1E293B] bg-[#64748B] px-4 py-2 text-xs font-black text-[#FEF08A] shadow-[3px_3px_0px_#1E293B] cursor-pointer"
          >
            Kembali ke Puncak Gunung
          </button>
        </div>
      </NgajiCeriaLayout>
    );
  }

  const selectedProgress = getSurahProgress(data, selectedSurah);

  return (
    <NgajiCeriaLayout
      title={`Puncak ${selectedSurah.namaLatin}`}
      hideHeader={true}
      showBack
      themeScope="tahfidz"
      onBack={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
    >
      {/* Latar Udara Puncak Gunung & Tebing Batu (#CBD5E1) */}
      <div className="min-h-[100dvh] w-full relative overflow-x-hidden bg-[#CBD5E1] text-[#0F172A] pb-32">
        {/* Siluet Puncak Gunung Berbatu di Latar Belakang */}
        <div
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-52 bg-[#475569] border-t-[4px] border-[#1E293B] z-0"
          style={{
            clipPath:
              "polygon(0% 55%, 22% 15%, 45% 45%, 72% 5%, 100% 40%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Header Tebing Batu Gunung (#475569) */}
        <ThemedHeader
          title={`Prasasti ${selectedSurah.namaLatin}`}
          onBack={() => navigate("/member/ngaji-ceria/explore/tahfidz")}
          themeColorClass="bg-[#475569] border-b-[4px] border-[#1E293B]"
          textColorClass="text-[#FEF08A]"
          statVariant="capsule"
          statBgClass="bg-[#1E293B] border-2 border-[#FEF08A]"
          statTextClass="text-[#FEF08A]"
          backClass="bg-[#FEF08A] text-[#1E293B] border-[2.5px] border-[#1E293B] shadow-[2px_2px_0px_#0F172A] hover:bg-[#FDE047]"
        />

        <div className="relative z-10">
          {/* Papan Kayu Pos Puncak Gunung */}
          <div className="relative overflow-hidden border-b-[4px] border-[#451A03] bg-[#78350F] p-4 text-[#FEF3C7] shadow-[0_4px_0px_#451A03]">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-[3px] border-[#451A03] bg-[#FEF08A] font-display text-base font-black text-[#451A03] shadow-[3px_3px_0px_#451A03]">
                  #{selectedSurah.surah}
                </div>
                <div>
                  <span className="inline-block rounded bg-[#D97706] border border-[#451A03] px-2 py-0.2 text-[9px] font-black uppercase tracking-widest text-[#FEF3C7]">
                    Pos Puncak Gunung
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-black leading-tight text-[#FEF08A]">
                    {selectedSurah.namaLatin}
                  </h3>
                  <p className="text-[11px] font-bold text-[#FDE68A]">
                    {selectedSurah.arti} • {selectedProgress.hafal}/
                    {selectedSurah.jumlahAyat} Prasasti Terukir (
                    {selectedProgress.percentage}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar Pendakian Puncak */}
            <div className="mx-auto mt-3 flex items-center gap-2 max-w-3xl">
              <div className="relative h-4 flex-1 rounded-full border-[3px] border-[#451A03] bg-[#451A03] overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    selectedProgress.complete ? "bg-[#15803D]" : "bg-[#FACC15]"
                  }`}
                  style={{ width: `${selectedProgress.percentage}%` }}
                />
              </div>
              <div className="flex items-center gap-1 shrink-0 bg-[#451A03] px-2.5 py-0.5 rounded-lg border border-[#D97706]">
                <LenteraIcon size={14} lit={selectedProgress.percentage > 0} />
                <span className="text-[10px] font-black text-[#FEF08A]">
                  {selectedProgress.complete
                    ? "Puncak!"
                    : `${selectedProgress.hafal} Batu`}
                </span>
              </div>
            </div>
          </div>

          {/* Mode Switcher: Papan Batu Tebing */}
          <div className="sticky top-14 z-20 flex items-center justify-between gap-2 border-b-[4px] border-[#1E293B] bg-[#64748B] px-4 py-3 shadow-[0_4px_0px_#1E293B]">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("baca")}
                className={`flex items-center gap-1.5 rounded-xl border-[3px] border-[#1E293B] px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  mode === "baca"
                    ? "bg-[#FEF08A] text-[#1E293B] shadow-[3px_3px_0px_#1E293B]"
                    : "bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]"
                }`}
              >
                <BookOpen size={13} /> Baca Prasasti
              </button>
              <button
                type="button"
                onClick={() => setMode("uji")}
                className={`flex items-center gap-1.5 rounded-xl border-[3px] border-[#1E293B] px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                  mode === "uji"
                    ? "bg-[#D97706] text-[#FEF3C7] shadow-[3px_3px_0px_#1E293B]"
                    : "bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]"
                }`}
              >
                <EyeOff size={13} /> Tutup Kabut (Uji Diri)
              </button>
            </div>

            <span className="text-[11px] font-black text-[#FEF08A] uppercase">
              {mode === "uji" ? "Uji Ingatan" : "Ukiran Batu"}
            </span>
          </div>

          {/* DAFTAR PRASASTI BATU BESAR BERWARNA ABU-ABU (#64748B) */}
          <div className="space-y-6 p-4 pt-6 max-w-3xl mx-auto">
            {isLoadingAyat ? (
              <div className="py-16 text-center">
                <div className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-[#64748B] border-t-[#1E293B]" />
                <p className="mt-2 text-xs font-black text-[#1E293B]">
                  Memahat prasasti batu ayat...
                </p>
              </div>
            ) : (
              surahAyatList.map((ayah, idx) => {
                const hafalStatus = isHafal(
                  selectedSurah.surah,
                  ayah.nomorAyat,
                );
                const isRevealed = revealedAyat.has(ayah.nomorAyat);
                const isAyahAudioActive =
                  isPlaying && currentAudioUrl === ayah.audioUrl;

                // Bentuk Puncak Prasasti Batu (Monolit Gunung)
                const monolithShape =
                  idx % 2 === 0
                    ? "rounded-t-[28px] rounded-b-2xl"
                    : "rounded-t-[22px] rounded-b-2xl";

                return (
                  <div
                    key={ayah.nomorAyat}
                    className={`relative ${monolithShape} border-[4px] border-[#1E293B] p-4 sm:p-5 transition-all ${
                      hafalStatus
                        ? "bg-[#475569] shadow-[6px_6px_0px_#15803D]"
                        : "bg-[#64748B] shadow-[6px_6px_0px_#1E293B]"
                    }`}
                  >
                    {/* Aksen Pahatan Sudut Prasasti Batu */}
                    <span className="pointer-events-none absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-sm bg-[#94A3B8] border border-[#1E293B]" />
                    <span className="pointer-events-none absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-sm bg-[#94A3B8] border border-[#1E293B]" />

                    {/* Baris Kontrol Atas Prasasti */}
                    <div className="mb-3 flex items-center justify-between border-b-[3px] border-dashed border-[#334155] pb-2.5 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl border-[2.5px] border-[#1E293B] bg-[#FEF08A] text-xs font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                          {ayah.nomorAyat}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggle(ayah.audioUrl)}
                          className={`flex h-8 items-center gap-1.5 rounded-xl border-[2.5px] border-[#1E293B] px-3 text-xs font-black transition-all active:scale-95 shadow-[2px_2px_0px_#1E293B] cursor-pointer ${
                            isAyahAudioActive
                              ? "bg-[#15803D] text-[#FFFFFF]"
                              : "bg-[#F8FAFC] text-[#1E293B] hover:bg-[#FEF08A]"
                          }`}
                        >
                          {isAyahAudioActive ? (
                            <EqualizerIcon
                              isPlaying={true}
                              size={12}
                              barClassName="bg-[#FFFFFF]"
                            />
                          ) : (
                            <Play size={12} />
                          )}
                          Gema Suara
                        </button>
                      </div>

                      {/* Tombol Tandai Hafal di Prasasti */}
                      <button
                        type="button"
                        onClick={() =>
                          handleToggleAyatHafal(
                            selectedSurah.surah,
                            ayah.nomorAyat,
                          )
                        }
                        className={`flex items-center gap-1.5 rounded-xl border-[2.5px] border-[#1E293B] px-3 py-1.5 text-xs font-black transition-all active:scale-95 shadow-[2px_2px_0px_#1E293B] cursor-pointer ${
                          hafalStatus
                            ? "bg-[#4ADE80] text-[#14532D]"
                            : "bg-[#1E293B] text-[#FEF08A] hover:bg-[#334155]"
                        }`}
                      >
                        <LenteraIcon size={13} lit={hafalStatus} />
                        {hafalStatus ? "Terukir Hafal" : "Tandai Hafal"}
                      </button>
                    </div>

                    {/* Bidang Pahatan Teks Arab di Prasasti Batu */}
                    <div className="relative py-2">
                      {mode === "uji" && !isRevealed ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-[3px] border-dashed border-[#CBD5E1] bg-[#334155] py-7 px-4 text-center">
                          <LenteraIcon
                            size={28}
                            lit={false}
                            className="mb-2 opacity-80"
                          />
                          <p className="mb-3 text-xs font-bold text-[#E2E8F0]">
                            Prasasti tertutup kabut puncak gunung untuk menguji
                            hafalanmu
                          </p>
                          <button
                            type="button"
                            onClick={() => toggleReveal(ayah.nomorAyat)}
                            className="flex items-center gap-1.5 rounded-xl border-[2.5px] border-[#1E293B] bg-[#FEF08A] px-4 py-2 text-xs font-black text-[#1E293B] shadow-[3px_3px_0px_#1E293B] hover:bg-[#FDE047] active:translate-y-[1px] cursor-pointer"
                          >
                            <Eye size={14} /> Singkap Kabut Batu
                          </button>
                        </div>
                      ) : (
                        <div className="rounded-2xl bg-[#334155] border-[3px] border-[#1E293B] p-4 shadow-inner">
                          <p
                            className="font-arabic text-[28px] sm:text-[32px] text-right leading-[2.3] text-[#FEF08A]"
                            dir="rtl"
                          >
                            {ayah.teksArab}
                          </p>

                          {mode === "uji" && isRevealed && (
                            <div className="mt-2 text-right">
                              <button
                                type="button"
                                onClick={() => toggleReveal(ayah.nomorAyat)}
                                className="inline-flex items-center gap-1 text-[11px] font-black text-[#FACC15] hover:underline cursor-pointer"
                              >
                                <EyeOff size={11} /> Tutup Kabut Kembali
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Papan Kayu Terjemahan di Kaki Prasasti Batu */}
                    {(mode === "baca" || isRevealed) && (
                      <div className="mt-3 rounded-xl bg-[#FEF3C7] border-[3px] border-[#451A03] p-3.5 text-left shadow-[3px_3px_0px_#451A03] space-y-1">
                        {ayah.teksLatin && (
                          <p className="text-xs font-black text-[#B45309] italic">
                            {ayah.teksLatin}
                          </p>
                        )}
                        {ayah.teksIndonesia && (
                          <p className="text-xs font-bold leading-relaxed text-[#451A03]">
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
