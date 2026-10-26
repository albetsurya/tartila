import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { NgajiCeriaLayout } from "../../components/NgajiCeriaLayout";
import { ThemedHeader } from "../../components/ThemedHeader";
import { Volume2, Pause, ChevronLeftSvg } from "../../../../components/ui/CustomIcons";
import { EqualizerIcon } from "@/components/ui/EqualizerIcon";
import { JUZ_AMMA_SURAHS, everyAyahAudio } from "./exploreData";
import { useAudioPlayer } from "../../hooks/useAudioPlayer";
import { triggerBibiReaction } from "../../../../utils/bibiEvent";

interface EquranAyah {
  nomorAyah: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio?: Record<string, string>;
}

interface EquranSurah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  ayat: EquranAyah[];
}

export default function JuzAmmaDetailPage() {
  const navigate = useNavigate();
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const surahMeta = useMemo(
    () => JUZ_AMMA_SURAHS.find((s) => s.number === Number(surahNumber)),
    [surahNumber],
  );
  const surahNum = surahMeta?.number ?? 78;

  const [surah, setSurah] = useState<EquranSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAyah, setExpandedAyah] = useState<number | null>(null);

  const { isPlaying, currentAudioUrl, play, pause, toggle } = useAudioPlayer();

  const fetchSurah = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://equran.id/api/v2/surat/${surahNum}`,
        { signal },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.code !== 200 || !json.data?.ayat) {
        throw new Error(json.message || "Data tidak valid");
      }
      setSurah(json.data as EquranSurah);
      setExpandedAyah(null);
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError("Gagal memuat ayat. Periksa koneksi internet lalu coba lagi.");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchSurah(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surahNum]);

  const playingAyah =
    isPlaying && currentAudioUrl
      ? Number(currentAudioUrl.match(/(\d{4,6})\.mp3/)?.[1]?.slice(-3))
      : null;

  const handlePlayAyah = (ayahNumber: number) => {
    triggerBibiReaction("play");
    const url = everyAyahAudio(surahNum, ayahNumber);
    if (isPlaying && currentAudioUrl === url) {
      pause();
      return;
    }
    if (isPlaying) {
      // Cengang paksa reset saat antara ayat, lalu mulai ayat baru.
      toggle(url);
      return;
    }
    play(url);
  };

  const handleBack = () => {
    navigate("/member/ngaji-ceria/explore/juz-amma");
  };

  if (!surahMeta) {
    return (
      <NgajiCeriaLayout
        title="Galaksi Juz 'Amma"
        hideHeader={true}
        showBack
        themeScope="juz-amma"
        onBack={handleBack}
      >
        <ThemedHeader
          title="Galaksi Juz 'Amma"
          onBack={handleBack}
          themeColorClass="bg-[#1E1B4B]"
          textColorClass="text-[#FEF08A]"
          statVariant="capsule"
        />
        <div className="flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="font-display text-xl font-black text-[#FEF08A]">
            Surah tidak ditemukan
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl bg-[#0D9488] px-4 py-2 text-sm font-black text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] cursor-pointer"
          >
            Kembali ke Peta Bintang
          </button>
        </div>
      </NgajiCeriaLayout>
    );
  }

  return (
    <NgajiCeriaLayout
      title={surahMeta.name}
      hideHeader={true}
      showBack
      themeScope="juz-amma"
      onBack={handleBack}
    >
      <ThemedHeader
        title={surahMeta.name}
        onBack={handleBack}
        themeColorClass="bg-[#1E1B4B]"
        textColorClass="text-[#FEF08A]"
        statVariant="capsule"
      />
      <div className="bg-[#F0FDF4] px-4 py-4 min-h-full pb-24">
        {/* HERO SURAH */}
        <section className="relative overflow-hidden rounded-[24px] bg-[#134E4A] p-5 text-white border-[3px] border-[#134E4A] shadow-[4px_4px_0px_#FF6B6B] mb-5">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full border-[6px] border-white/5" />
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#FF6B6B] px-3 py-1 text-[10px] font-black text-white border-2 border-[#134E4A]">
              Surah {surahMeta.number}
            </span>
            <h2
              dir="rtl"
              className="mt-2 font-arabic text-3xl font-bold leading-loose text-white"
            >
              {surah?.nama ?? ""}
            </h2>
            <p className="font-display text-xl font-black">{surahMeta.name}</p>
            <p className="text-[11px] font-bold text-white/80">
              {surah ? `${surah.arti} · ${surah.tempatTurun}` : "Memuat…"} ·{" "}
              {surahMeta.ayah} ayat
            </p>
          </div>
        </section>

        {/* LOADING / ERROR */}
        {loading && (
          <div className="flex flex-col items-center gap-3 py-12 text-[#134E4A]">
            <span className="block h-10 w-10 animate-spin rounded-full border-[3px] border-[#134E4A]/20 border-t-[#134E4A]" />
            <p className="text-sm font-bold text-[#134E4A]/70">
              Mengumpulkan ayat…
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-[3px] border-[#FF6B6B] bg-[#FFF0F0] p-6 text-center shadow-[3px_3px_0px_#134E4A]">
            <p className="text-sm font-bold text-[#FF6B6B]">{error}</p>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                void fetchSurah();
              }}
              className="rounded-xl bg-[#FF6B6B] px-4 py-2 text-xs font-black text-white border-2 border-[#134E4A] shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px]"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* LIST AYAT */}
        {!loading && !error && surah?.ayat && (
          <section className="space-y-3">
            {surah.ayat.map((ayah) => {
              const url = everyAyahAudio(surahNum, ayah.nomorAyah);
              const isAyahPlaying = isPlaying && currentAudioUrl === url;
              return (
                <motion.article
                  key={ayah.nomorAyah}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0 }}
                  className={`relative rounded-2xl border-[3px] p-4 shadow-[3px_3px_0px_#134E4A] transition-colors ${
                    playingAyah === ayah.nomorAyah
                      ? "bg-[#CCFBF1] border-[#134E4A]"
                      : "bg-white border-[#134E4A]"
                  }`}
                >
                  {/* Baris atas: nomor + aksi */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#134E4A] text-xs font-black ${
                        playingAyah === ayah.nomorAyah
                          ? "bg-[#FF6B6B] text-white"
                          : "bg-[#F0FDF4] text-[#134E4A]"
                      }`}
                    >
                      {ayah.nomorAyah}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePlayAyah(ayah.nomorAyah)}
                      aria-label={
                        isAyahPlaying
                          ? `Jeda ayat ${ayah.nomorAyah}`
                          : `Putar ayat ${ayah.nomorAyah}`
                      }
                      className={`flex h-9 min-w-[52px] items-center justify-center gap-1.5 rounded-xl border-2 border-[#134E4A] px-2.5 text-[11px] font-black shadow-[2px_2px_0px_#134E4A] active:translate-y-[1px] active:shadow-none transition-all ${
                        isAyahPlaying
                          ? "bg-[#FF6B6B] text-white"
                          : "bg-white text-[#134E4A]"
                      }`}
                    >
                      {isAyahPlaying ? (
                        <EqualizerIcon isPlaying={true} size={13} barClassName="bg-white" />
                      ) : (
                        <Volume2 size={13} />
                      )}
                      {isAyahPlaying ? "Jeda" : "Putar"}
                    </button>
                  </div>

                  {/* Teks Arab */}
                  <p
                    dir="rtl"
                    className="font-arabic text-2xl leading-loose text-[#134E4A] text-right"
                  >
                    {ayah.teksArab}
                  </p>

                  {/* Latin + terjemahan ringkas (dapat dibuka) */}
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedAyah(
                        expandedAyah === ayah.nomorAyah ? null : ayah.nomorAyah,
                      )
                    }
                    className="mt-3 text-left text-[10px] font-black uppercase tracking-wide text-[#0D9488] active:scale-95"
                  >
                    {expandedAyah === ayah.nomorAyah
                      ? "Sembunyikan terjemahan" : "Terjemahan"}
                  </button>
                  {expandedAyah === ayah.nomorAyah && (
                    <div className="mt-2 rounded-xl border-2 border-dashed border-[#134E4A]/40 bg-[#F0FDF4] p-3">
                      <p className="text-[11px] font-bold italic text-[#134E4A]/70">
                        {ayah.teksLatin}
                      </p>
                      <p className="mt-1.5 text-xs font-semibold leading-relaxed text-[#134E4A]">
                        {ayah.teksIndonesia}
                      </p>
                    </div>
                  )}
                </motion.article>
              );
            })}
          </section>
        )}

        {/*aksi berikutnya / sebelumnya */}
        {!loading && !error && surah && (
          <div className="mt-6 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={surahNum <= 78}
              onClick={() => navigate(`/member/ngaji-ceria/explore/juz-amma/${surahNum - 1}`)}
              className="flex items-center gap-1 rounded-xl border-2 border-[#134E4A] bg-white px-3 py-2 text-xs font-black text-[#134E4A] shadow-[2px_2px_0px_#134E4A] disabled:opacity-40"
            >
              <ChevronLeftSvg size={13} /> Sebelumnya
            </button>
            <button
              type="button"
              disabled={surahNum >= 114}
              onClick={() => navigate(`/member/ngaji-ceria/explore/juz-amma/${surahNum + 1}`)}
              className="rounded-xl border-2 border-[#134E4A] bg-[#0D9488] px-3 py-2 text-xs font-black text-white shadow-[2px_2px_0px_#134E4A] disabled:opacity-40"
            >
              Surah Berikutnya
            </button>
          </div>
        )}
      </div>
    </NgajiCeriaLayout>
  );
}
